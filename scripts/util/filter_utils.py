#!/usr/bin/python3

import scripts.util.ncbi_utils as ncbi_utils
import scripts.constants as constants
import xml.etree.ElementTree as ET
import os
import xml.dom.pulldom as pulldom
import gzip
import codecs


def is_homo_sapiens_sample(sample):
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


def has_attributes(sample, min_count):
    """
    Check if a sample has a minimum number of relevant attributes
    :param sample: A string containing a biosample in xml format
    :param min_count: Minimum number of attributes
    :return: Boolean
    """
    relevant_att_names = constants.NCBI_FILTER_RELEVANT_ATTS
    biosample_node = ET.fromstring(sample)
    attributes = biosample_node.find('Attributes')
    if attributes is not None:
        if len(attributes) >= min_count:
            matches = 0
            for att in attributes:
                attribute_name = ncbi_utils.normalize_attribute_name(att.get('attribute_name'))
                display_name = ncbi_utils.normalize_attribute_name(att.get('display_name'))
                harmonized_name = ncbi_utils.normalize_attribute_name(att.get('harmonized_name'))
                value = None
                if attribute_name in relevant_att_names \
                        or display_name in relevant_att_names \
                        or harmonized_name in relevant_att_names:
                    value = att.text

                # Check if the value is valid
                if value is not None and ncbi_utils.is_valid_value(value):
                    matches = matches + 1

            if matches >= min_count:
                return True
            else:
                return False
        else:
            return False
    else:
        return False


def filter_samples(input_file, output_file, is_homo_sapiens_filter, has_attributes_filter, log_frequency=100000):
    if is_homo_sapiens_filter:
        output_file = output_file
    if not os.path.exists(os.path.dirname(output_file)):
        os.makedirs(os.path.dirname(output_file))
    print('Input file: ' + input_file)
    print('Output file: ' + output_file)
    print('Processing NCBI samples...')
    # Read biosamples from XML file
    content = pulldom.parse(gzip.open(input_file))
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
                    if not is_homo_sapiens_sample(node_xml):
                        selected = False
                if selected and has_attributes_filter:
                    if not has_attributes_filter(node_xml):
                        selected = False

                if selected:
                    f.write('\n' + node.toxml())
                    selected_samples_count = selected_samples_count + 1

        f.write("\n</BioSampleSet>\n")
    f.close()

    print('Finished processing NCBI samples')
    print('- Total samples processed: ' + str(processed_samples_count))
    print('- Total samples selected: ' + str(selected_samples_count))