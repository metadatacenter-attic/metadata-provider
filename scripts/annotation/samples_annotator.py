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
import time

ATT_NAME_TERM_URI = 'att_name_term_uri'
ATT_NAME_TERM_LABEL = 'att_name_term_label'
ATT_NAME_TERM_SOURCE = 'att_name_term_source'
ATT_VALUE_TERM_URI = 'att_value_term_uri'
ATT_VALUE_TERM_LABEL = 'att_value_term_label'
ATT_VALUE_TERM_SOURCE = 'att_value_term_source'


def annotate_attribute_names(sample):
    """
    Annotate the sample's attribute names
    :param sample:
    :return:
    """
    sample_attributes = biosample_json_utils.get_attributes(sample)
    for att in sample_attributes:
        att_name = biosample_json_utils.get_attribute_name(att)

        att[ATT_NAME_TERM_URI] = 'name term uri'
        att[ATT_NAME_TERM_LABEL] = 'name term label'
        att[ATT_NAME_TERM_SOURCE] = 'name term source'
    return sample


def annotate_attribute_values(sample):
    """
    Annotate the sample's attribute values
    :param sample:
    :return:
    """
    sample_attributes = biosample_json_utils.get_attributes(sample)
    for att in sample_attributes:
        att_value = biosample_json_utils.get_attribute_value(att)
        att[ATT_VALUE_TERM_URI] = 'value term uri'
        att[ATT_VALUE_TERM_LABEL] = 'value term label'
        att[ATT_VALUE_TERM_SOURCE] = 'value term source'
    return sample


def annotate_sample(sample, annotate_att_names=True, annotate_att_values=True):
    if annotate_att_names:
        annotate_attribute_names(sample)
    if annotate_att_values:
        annotate_attribute_values(sample)
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
            att_name_var_norm = annotator_util.normalize_term(att_name_var)  # normalize variation
            if att_name_var_norm not in att_norm_names:
                att_norm_names[att_name_var_norm] = att_name_norm

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
                att_value_var_norm = annotator_util.normalize_term(att_value_var)  # normalize variation
                if att_value_var_norm not in att_norm_values:
                    att_norm_values[att_value_var_norm] = att_value_norm

    with open(file_path, "w") as f:
        json.dump(att_norm_values, f, indent=2)


def read_annotation_cache(att_names_annotation_cache_file_path):
    return None


def get_annotation(attribute_name, attribute_value=None):
   
    annotation = {}
    if attribute_name is not None:

        if attribute_value is not None:
            term = attribute_value
            # term normalization
        else:
            term = attribute_name
            # term normalization

        annotator_result = bioportal_util.annotate(api_key, term, ontologies=['NCIT'], longest_only=False,
                                                   expand_mappings=False, include=['prefLabel'])

        if len(annotator_result) > 0:
            selected_result = annotator_result[0]
            annotation['term-uri'] = selected_result['annotatedClass']['@id']
            annotation['term-label'] = selected_result['annotatedClass']['prefLabel']
            annotation['term-source'] = bioportal_util.get_ontology_id(selected_result)
            return annotation
        else:
            print('No annotations found. Term: ' + term)
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
    annotation_cache = {
        "att-names": {},
        "att-values": {}
    }

    # Extract unique attribute names and values from samples. These unique values will be used to build the cache.
    # The annotation, and therefore the cache and the extraction of the unique terms, will be limited to the attributes
    # specified in att_names_values_variations

    unique_att_names_values = annotator_util.extract_unique_attribute_names_values(samples, att_names_values_variations)

    for att_name in unique_att_names_values:
        # Annotate attribute name
        print('att_name: ' + att_name)
        annotation_cache['att_names'][att_name] = get_annotation(att_name)
        time.sleep(.300)


def annotate_samples(input_file, output_file, att_names_values_variations, annotation_cache_file_path,
                     regenerate_annotation_cache=False):
    """
    Annotates a list of BioSample samples in JSON format
    :param input_file:
    :param output_file:
    :return:
    """
    print('Input file (original samples): ' + input_file)
    print('Output file (annotated samples): ' + output_file)

    run = True
    if os.path.exists(output_file):
        if not utils.confirm('The destination file already exist. Do you want to overwrite it [y/n]? '):
            run = False
    if run:
        if not os.path.exists(os.path.dirname(output_file)):
            os.makedirs(os.path.dirname(output_file))

        with open(input_file) as json_file:
            original_samples = json.load(json_file)

        # Generate files with normalized attribute names and values. These normalized terms will be used later, to
        # ensure that the NCBO Annotator is able to return the right URI for them
        generate_norm_att_names_file(constants.ANNOTATION_NORMALIZED_ATT_NAMES_FILE, att_names_values_variations)
        generate_norm_att_values_file(constants.ANNOTATION_NORMALIZED_ATT_VALUES_FILE, att_names_values_variations)

        # Read normalized attribute names and values (note that I could also return dicts from the previous methods)
        with open(constants.ANNOTATION_NORMALIZED_ATT_NAMES_FILE) as norm_att_names_file:
            norm_att_names = json.load(norm_att_names_file)
        with open(constants.ANNOTATION_NORMALIZED_ATT_VALUES_FILE) as norm_values_file:
            norm_att_values = json.load(norm_values_file)

        # Generate it if needed
        if regenerate_annotation_cache or not os.path.exists(annotation_cache_file_path):
            print('Generating annotation cache. Path: ' + annotation_cache_file_path)
            build_annotation_cache(original_samples, att_names_values_variations, annotation_cache_file_path)

        # Read annotation cache
        annotation_cache = read_annotation_cache(annotation_cache_file_path)

        annotated_samples = []
        for sample in original_samples:
            annotated_sample = annotate_sample(sample, annotation_cache)
            annotated_samples.append(annotated_sample)

        with open(output_file, 'w') as f:
            json.dump(annotated_samples, f)

        print('Finished annotating NCBI samples')
        print('- Total samples processed: ' + str(len(original_samples)))
        print('- Total samples annotated and saved to output file: ' + str(len(annotated_samples)))
