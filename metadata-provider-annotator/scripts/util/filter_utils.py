#!/usr/bin/python3

import scripts.util.utils as utils
import scripts.constants as constants
import xml.etree.ElementTree as ET
import os
import codecs


def is_homo_sapiens(sample):
    """
    Check if a sample is from homo sapiens
    :param sample: A string containing a biosample in xml format
    :return: Boolean
    """
    biosample_node = ET.fromstring(sample)
    description = biosample_node.find('Description')
    if description is not None:
        organism = description.find('Organism')
        if organism is not None:
            organism_name = organism.get('taxonomy_name')
            if organism_name == 'Homo sapiens':
                return True
    return False


def has_attributes(sample, required_attributes):
    """
    :param sample:
    :param required_attributes: list of relevant attribute names, values, and their variations
    :return: Boolean
    """
    # print('------------------')
    # print(sample)
    biosample_node = ET.fromstring(sample)
    sample_atts = biosample_node.find('Attributes')
    if sample_atts is not None:

        # Check if the sample contains all the required attribute names and values
        for required_att in required_attributes:
            att_name_found = False
            search_for_att_value = False
            att_value_found = False
            if len(required_att['att_values']) > 0:
                search_for_att_value = True

            for sample_att in sample_atts:
                attribute_name = sample_att.get('attribute_name')
                display_name = sample_att.get('display_name')
                harmonized_name = sample_att.get('harmonized_name')

                # Avoid unnecessary comparisons
                if utils.equal_norm_str(display_name, attribute_name):
                    display_name = None
                if utils.equal_norm_str(harmonized_name, attribute_name):
                    harmonized_name = None
                if utils.equal_norm_str(display_name, harmonized_name):
                    display_name = None

                # Check if the current sample attribute matches the required attribute
                if utils.contained_in_list_norm_str(attribute_name, required_att['att_name_variations']) \
                        or utils.contained_in_list_norm_str(display_name, required_att['att_name_variations']) \
                        or utils.contained_in_list_norm_str(harmonized_name, required_att['att_name_variations']):

                    att_name_found = True  # Attribute name found

                    if search_for_att_value:
                        sample_att_value = sample_att.text  # attribute value
                        for req_value_obj in required_att['att_values']:
                            all_variations = []
                            for variation in req_value_obj['att_value_variations']:
                                # Add permutations
                                all_variations.extend(utils.generate_str_permutations(variation))
                            for v in all_variations:
                                if utils.equal_norm_str(sample_att_value, v):
                                    att_value_found = True  # Attribute value found
                                    break

                            if att_value_found:  # Attribute value found, break outer look too
                                break

            # This if is done after evaluating all the sample attributes because some samples have the same attribute
            # several times, using different variations, and the value that we are looking for is only in one of them
            if search_for_att_value and not att_value_found:
                return False

            # Attribute name not found
            if not att_name_found:
                return False

        # The sample meets all the requirements
        return True

    else:  # sample_atts is None
        return False


def filter_samples(input_file, output_file, is_homo_sapiens_filter, has_attributes_filter, required_attributes,
                   log_frequency=100000):
    """
    Select the samples that have, at the minimum, a given list of attributes
    :param input_file: BioSample samples in XML format
    :param output_file:
    :param is_homo_sapiens_filter:
    :param has_attributes_filter:
    :param required_attributes: list of relevant attributes and synonyms that can be used to refer to each of them
    :param log_frequency:
    :return:
    """
    if is_homo_sapiens_filter:
        output_file = output_file
    if not os.path.exists(os.path.dirname(output_file)):
        os.makedirs(os.path.dirname(output_file))
    print('Input file: ' + input_file)
    print('Output file: ' + output_file)
    if has_attributes_filter:
        print('Required attribute names and values: ')
        print(required_attributes)
    print('Processing NCBI samples...')
    # Read biosamples from XML file
    content = utils.read_xml_or_gz_file(input_file)

    processed_samples_count = 0
    selected_samples_count = 0
    with codecs.open(output_file, 'w', 'utf-8') as f:
        f.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n")
        f.write("<BioSampleSet>")
        for event, node in content:
            if event == 'START_ELEMENT' and node.tagName == 'BioSample':
                content.expandNode(node)
                node_xml = node.toxml()
                processed_samples_count = processed_samples_count + 1

                if processed_samples_count % log_frequency == 0:
                    print('Processed samples: ' + str(processed_samples_count))
                    print('Selected samples: ' + str(selected_samples_count))

                selected = True
                if is_homo_sapiens_filter:
                    if not is_homo_sapiens(node_xml):
                        selected = False
                if selected and has_attributes_filter:
                    if not has_attributes(node_xml, required_attributes):
                        selected = False

                if selected:
                    f.write('\n' + node.toxml())
                    selected_samples_count = selected_samples_count + 1

        f.write("\n</BioSampleSet>\n")
    f.close()

    print('Finished processing NCBI samples')
    print('- Total samples processed: ' + str(processed_samples_count))
    print('- Total samples selected: ' + str(selected_samples_count))


def filter_atts_and_variations(filter_specs, atts_and_variations):
    """
    Keeps only the attribute names and variations for the attribute names and values specified in filter_specs.
    Note that if the users specifies an attribute name or value in the filter specs that is not in the object with
    the attribute names/values variations, the method will throw an exception
    :param filter_specs: the attribute names and values that will be used for filtering
    :param atts_and_variations: Object with all the attribute names, values, and their variations
    :return: a new array of objects with only the relevant attributes names, values, and their variations
    """
    result = []
    for spec in filter_specs:
        spec_att_name_found = False
        spec_check_att_value = False
        for av in atts_and_variations:
            if av['att_name'] == spec['att_name']:
                spec_att_name_found = True
                new_av = av.copy()
                new_av['att_values'] = []
                if 'att_values' in spec and len(spec['att_values']) > 0:
                    spec_att_value_found = False
                    spec_check_att_value = True
                    for spec_att_value in spec['att_values']:
                        for att_values_item in av['att_values']:
                            if spec_att_value == att_values_item['att_value']:
                                spec_att_value_found = True
                                new_av['att_values'].append(att_values_item)

                result.append(new_av)

        if (not spec_att_name_found) or (spec_att_name_found and (spec_check_att_value and not spec_att_value_found)):
            raise ValueError("Unknown attribute name or value in the spec filter")

    return result


def filter_samples_by_attributes(root_folder_name, input_file, output_file, filter_specs, atts_and_variations,
                                 log_frequency=100000):
    """
    Utility to filter NCBI biosamples by attribute names and/or attribute values
    :param root_folder_name:
    :param input_file:
    :param output_file:
    :param filter_specs:
    :param atts_and_variations:
    :param log_frequency:
    :return:
    """
    constants.BASE_FOLDER = utils.get_base_folder(root_folder_name)
    execute = True
    if os.path.exists(output_file):
        if not utils.confirm('The destination file already exist. Do you want to overwrite it [y/n]? '):
            execute = False
    if execute:
        relevant_atts_and_variations = filter_atts_and_variations(filter_specs, atts_and_variations)
        filter_samples(input_file, output_file, True, True, relevant_atts_and_variations, log_frequency)
