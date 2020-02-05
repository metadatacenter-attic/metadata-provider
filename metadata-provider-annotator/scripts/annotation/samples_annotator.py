#!/usr/bin/python3

# Utilities to annotate BioSample samples using ontology terms

import sys
import os
import scripts.util.utils as utils
import json
import scripts.util.biosample_json_utils as biosample_json_utils
import scripts.annotation.util.samples_annotator_util as annotator_util
import scripts.annotation.util.bioportal_util as bioportal_util
import scripts.constants as constants
import scripts.util.filter_utils as filter_utils
import time

ATT_NAME_TERM_URI = 'attributeNameTermUri'
ATT_NAME_TERM_LABEL = 'attributeNameTermLabel'
ATT_NAME_TERM_SOURCE = 'attributeNameTermSource'
ATT_VALUE_TERM_URI = 'attributeValueTermUri'
ATT_VALUE_TERM_LABEL = 'attributeValueTermLabel'
ATT_VALUE_TERM_SOURCE = 'attributeValueTermSource'


def annotate_attribute_names(sample, annotation_cache, relevant_atts_and_variations):
    """
    Annotate the sample's attribute names
    :param sample:
    :return:
    """
    sample_attributes = biosample_json_utils.get_attributes(sample)
    for att in sample_attributes:
        att_name = biosample_json_utils.get_attribute_name(att)
        if annotator_util.is_relevant_attribute(att_name, relevant_atts_and_variations):
            annotation = get_cached_annotation(annotation_cache, att_name)
            if annotation is not None:
                att[ATT_NAME_TERM_URI] = annotation['term-uri']
                att[ATT_NAME_TERM_LABEL] = annotation['term-label']
                att[ATT_NAME_TERM_SOURCE] = annotation['term-source']
    return sample


def annotate_attribute_values(sample, annotation_cache, relevant_atts_and_variations):
    """
    Annotate the sample's attribute values
    :param sample:
    :return:
    """
    sample_attributes = biosample_json_utils.get_attributes(sample)
    for att in sample_attributes:
        att_name = biosample_json_utils.get_attribute_name(att)
        if annotator_util.is_relevant_attribute(att_name, relevant_atts_and_variations):
            att_value = biosample_json_utils.get_attribute_value(att)
            annotation = get_cached_annotation(annotation_cache, att_name, att_value)
            if annotation is not None:
                att[ATT_VALUE_TERM_URI] = annotation['term-uri']
                att[ATT_VALUE_TERM_LABEL] = annotation['term-label']
                att[ATT_VALUE_TERM_SOURCE] = annotation['term-source']
    return sample


def annotate_sample(sample, annotation_cache, relevant_atts_and_variations, annotate_att_names=True, annotate_att_values=True):
    if annotate_att_names:
        sample = annotate_attribute_names(sample, annotation_cache, relevant_atts_and_variations)
    if annotate_att_values:
        sample = annotate_attribute_values(sample, annotation_cache, relevant_atts_and_variations)
    return sample


def generate_norm_att_names_file(file_path, att_names_values_variations):
    """
    Uses an input dictionary with attribute names, values, and their variations to generate a JSON file with key-value pairs, where key is a variation and value the normalized term
    :param file_path:
    :param att_names_values_variations:
    :return:
    """
    att_norm_names = {}
    print('Creating file with normalized attribute names : ' + file_path)
    if not os.path.exists(os.path.dirname(file_path)):
        os.makedirs(os.path.dirname(file_path))

    for att_var in att_names_values_variations:
        att_name_norm = annotator_util.normalize_term(att_var['att_name'])
        for att_name_var in att_var['att_name_variations']:
            if att_name_var not in att_norm_names:
                att_norm_names[att_name_var] = att_name_norm

    with open(file_path, "w") as f:
        json.dump(att_norm_names, f, indent=2)


def generate_norm_att_values_file(file_path, att_names_values_variations):
    """

    :param file_path:
    :param att_names_values_variations:
    :return:
    """
    att_norm_values = {}
    print('Creating file with normalized attribute values : ' + file_path)
    if not os.path.exists(os.path.dirname(file_path)):
        os.makedirs(os.path.dirname(file_path))

    for att_var in att_names_values_variations:
        for att_values in att_var['att_values']:
            att_value_norm = annotator_util.normalize_term(att_values['att_value'])
            for att_value_var in att_values['att_value_variations']:
                if att_value_var not in att_norm_values:
                    att_norm_values[att_value_var] = att_value_norm

    with open(file_path, "w") as f:
        json.dump(att_norm_values, f, indent=2)


def extract_annotation(annotator_results):
    """
    Get the first annotation returned and generates an annotation object with the fields needed
    :param annotator_results:
    :return:
    """
    if len(annotator_results) > 0:
        annotation = {}
        selected_result = annotator_results[0]
        annotation['term-uri'] = selected_result['annotatedClass']['@id']
        annotation['term-label'] = selected_result['annotatedClass']['prefLabel']
        annotation['term-source'] = bioportal_util.get_ontology_id(selected_result)
        return annotation
    else:
        print('Error: The annotation results are empty')
        return None


def get_annotation(attribute_name, attribute_value=None, norm_attribute_names=None, norm_attribute_values=None):
    if attribute_name is not None:

        if attribute_value is None:
            print('Annotating attribute name: ' + attribute_name)
            term = annotator_util.normalize_term(attribute_name, norm_attribute_names)
        else:
            print('Annotating attribute value: ' + attribute_value + ' (attribute name: ' + attribute_name + ')')
            term = annotator_util.normalize_term(attribute_value, norm_attribute_values)

        annotator_results = bioportal_util.annotate(constants.BIOPORTAL_APIKEY, term, ontologies=['NCIT'],
                                                    longest_only=False,
                                                    expand_mappings=False, include=['prefLabel'])

        if len(annotator_results) > 0:
            annotation = extract_annotation(annotator_results)
            print('  Annotation:' + str(annotation));
            return annotation
        else:
            print('  No annotations found. Term: ' + term)
            return None
    else:
        sys.exit('Error: attribute name is None')


def build_annotation_cache(samples, att_names_values_variations, annotation_cache_file_path):
    """
    Build annotation cache, according to the following structure:
    {
        "att-names": {
            "disease": {
                "term-uri":"...",
                "term-label":"...",
                "term-source":"..."
            },
            "sex": {...},
            ...
        },
        "att-values": {
            "disease": {
                "liver cancer": {
                    "term-uri":"...",
                    "term-label":"...",
                    "term-source":"..."
                },
                "hcc": {...}
            },
            "sex": {...},
            ...
        }
    }
    """

    # Generate files with normalized attribute names and values. These normalized terms will be used later, to
    # ensure that the NCBO Annotator is able to return the right URI for them
    generate_norm_att_names_file(constants.ANNOTATION_NORMALIZED_ATT_NAMES_FILE, att_names_values_variations)
    generate_norm_att_values_file(constants.ANNOTATION_NORMALIZED_ATT_VALUES_FILE, att_names_values_variations)

    # Read normalized attribute names and values (note that I could also return dicts from the previous methods)
    with open(constants.ANNOTATION_NORMALIZED_ATT_NAMES_FILE) as norm_att_names_file:
        norm_att_names = json.load(norm_att_names_file)
    with open(constants.ANNOTATION_NORMALIZED_ATT_VALUES_FILE) as norm_values_file:
        norm_att_values = json.load(norm_values_file)

    annotation_cache = {
        "att-names": {},
        "att-values": {}
    }

    # Extract unique attribute names and values from samples. These unique values will be used to build the cache.
    # The annotation, and therefore the cache and the extraction of the unique terms, will be limited to the attributes
    # specified in att_names_values_variations
    unique_att_names_values = annotator_util.extract_unique_attribute_names_values(samples, att_names_values_variations)

    # Populate cache with annotations for attribute names
    for att_name in unique_att_names_values:
        if att_name not in annotation_cache['att-names']:
            annotation_cache['att-names'][att_name] = get_annotation(attribute_name=att_name, attribute_value=None,
                                                                     norm_attribute_names=norm_att_names,
                                                                     norm_attribute_values=None)
        else:
            continue  # do nothing

        time.sleep(.100)

    # Populate cache with annotations for attribute values
    for att_name in unique_att_names_values:
        for att_value in unique_att_names_values[att_name]:
            # Only first iteration
            if att_name not in annotation_cache['att-values']:
                annotation_cache['att-values'][att_name] = {}
            # All iterations
            if att_value not in annotation_cache['att-values'][att_name]:
                annotation_cache['att-values'][att_name][att_value] = get_annotation(attribute_name=att_name,
                                                                                attribute_value=att_value,
                                                                                norm_attribute_names=norm_att_names,
                                                                                norm_attribute_values=norm_att_values)
            else:
                continue  # do nothing
    print('Saving annotation cache to file: ' + annotation_cache_file_path)

    with open(annotation_cache_file_path, 'w') as f:
        json.dump(annotation_cache, f, indent=2)

    print(annotation_cache)


def get_cached_annotation(annotation_cache, attribute_name, attribute_value=None):

    if attribute_value is None:
        if attribute_name in annotation_cache['att-names']:
            return annotation_cache['att-names'][attribute_name]
        else:
            print('Attribute name not found in cache: ' + attribute_name)
    else:
        if attribute_value in annotation_cache['att-values'][attribute_name]:
            return annotation_cache['att-values'][attribute_name][attribute_value]
        else:
            print('Attribute value not found in cache: ' + attribute_value + ' (Attribute name: ' + attribute_name + ')')


def annotate_samples(input_file, output_file, att_names_values_variations, annotation_filter_specs,
                     annotation_cache_file_path, regenerate_annotation_cache=False):
    """
    Annotates a list of BioSample samples in JSON format
    :param input_file:
    :param output_file:
    :return:
    """
    print('Input file (original samples): ' + input_file)
    print('Output file (annotated samples): ' + output_file)

    relevant_atts_and_variations = filter_utils.filter_atts_and_variations(annotation_filter_specs,
                                                                           att_names_values_variations)
    run = True
    if os.path.exists(output_file):
        if not utils.confirm('The destination file already exist. Do you want to overwrite it [y/n]? '):
            run = False
    if run:
        if not os.path.exists(os.path.dirname(output_file)):
            os.makedirs(os.path.dirname(output_file))

        with open(input_file) as f:
            original_samples = json.load(f)

        # Generate it if needed
        if regenerate_annotation_cache or not os.path.exists(annotation_cache_file_path):
            print('Generating annotation cache. Path: ' + annotation_cache_file_path)
            build_annotation_cache(original_samples, relevant_atts_and_variations, annotation_cache_file_path)

        # Read annotation cache
        with open(annotation_cache_file_path) as f:
            annotation_cache = json.load(f)

        annotated_samples = []
        for sample in original_samples:
            annotated_sample = annotate_sample(sample, annotation_cache, relevant_atts_and_variations)
            annotated_samples.append(annotated_sample)

        with open(output_file, 'w') as f:
            json.dump(annotated_samples, f)

        print('Finished annotating NCBI samples')
        print('- Total samples processed: ' + str(len(original_samples)))
        print('- Total samples annotated and saved to output file: ' + str(len(annotated_samples)))
