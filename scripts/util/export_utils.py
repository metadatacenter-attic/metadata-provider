#!/usr/bin/python3

import scripts.util.utils as utils
import scripts.util.filter_utils as filter_utils
import scripts.constants as constants
import xml.etree.ElementTree as ET
import os
import codecs
import sys


def sample_to_json(sample, required_attributes):
    """

    :param sample:
    :param required_attributes:
    :return:
    """
    sample_json = {}

    biosample_node = ET.fromstring(sample)
    sample_atts = biosample_node.find('Attributes')
    if sample_atts is not None:

        # Export only the required attributes and their values
        for required_att in required_attributes:
            found = False
            for sample_att in sample_atts:
                attribute_name = sample_att.get('attribute_name')
                display_name = sample_att.get('display_name')
                harmonized_name = sample_att.get('harmonized_name')

                # Check if the current sample attribute matches the required attribute
                if (attribute_name is not None and attribute_name in required_att['att_name_variations']) or \
                        (display_name is not None and display_name in required_att['att_name_variations']) or \
                        (harmonized_name is not None and harmonized_name in required_att['att_name_variations']):

                    # Attribute found. Add it to the json object using the reference name in required_attributes
                    found = True
                    sample_json[required_att['att_name']] = sample_att.text
                    break

            if not found:
                print('Error: attribute to be exported was not found in sample: ' + required_att['att_name'])
                sys.exit(1)

        return sample_json


def export_samples_to_csv(root_folder_name, input_file, output_file, filter_specs, atts_and_variations,
                          log_frequency=1000):
    """

    :param samples: samples in BioSamples's XML format
    :param attributes:
    :return:
    """
    constants.BASE_FOLDER = utils.get_base_folder(root_folder_name)
    execute = True
    if os.path.exists(output_file):
        if not utils.confirm('The destination file already exist. Do you want to overwrite it [y/n]? '):
            execute = False
    if execute:
        # attribute names and variations of the attributes to be exported. We need to do this to be able to aggregate
        # different attribute variations so that the attribute values will be shown under the same column header
        relevant_atts_and_variations = filter_utils.filter_atts_and_variations(filter_specs, atts_and_variations)

        # Read and export samples
        exported_samples = []

        if not os.path.exists(os.path.dirname(output_file)):
            os.makedirs(os.path.dirname(output_file))

        print('Input file: ' + input_file)
        print('Output file: ' + output_file)
        print('Attributes to be exported: ' + str(filter_specs))
        print('Processing NCBI samples...')
        # Read biosamples from XML file
        content = utils.read_xml_or_gz_file(input_file)

        processed_samples_count = 0

        for event, node in content:
            if event == 'START_ELEMENT' and node.tagName == 'BioSample':
                content.expandNode(node)
                node_xml = node.toxml()
                processed_samples_count = processed_samples_count + 1

                if processed_samples_count % log_frequency == 0:
                    print('Processed samples: ' + str(processed_samples_count))

                exported_samples.append(sample_to_json(node_xml, relevant_atts_and_variations))

        utils.save_json_to_csv(exported_samples, output_file)

        print('Finished processing NCBI samples')
        print('- Total samples processed: ' + str(processed_samples_count))
        print('- Total samples exported: ' + str(len(exported_samples)))