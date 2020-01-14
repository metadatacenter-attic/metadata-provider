#!/usr/bin/python3

# Utility to filter NCBI biosamples based on different criteria. It generates an output XML file with all the selected biosamples

import codecs
import xml.dom.pulldom as pulldom
import xml.etree.ElementTree as ET
import os
import constants
import ncbi_util
import gzip
import util

INPUT_FILE = constants.NCBI_FILTER_INPUT_FILE
OUTPUT_FILE = constants.NCBI_FILTER_OUTPUT_FILE


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


def is_geo_sample(sample):
    """
    Check if a sample is from the GEO database
    :param sample: A string containing a biosample in xml format
    :return: Boolean
    """
    biosample_node = ET.fromstring(sample)
    ids = biosample_node.find('Ids')
    if ids is not None:
        for id in ids:

            db = id.get('db')
            if db == 'GEO':
                return True
    return False


def has_minimum_attributes_count(sample, min_count=3):
    """
    Check if a sample has a minimum number of attributes
    :param sample: A string containing a biosample in xml format
    :param min_count: Minimum number of attributes
    :return: Boolean
    """
    biosample_node = ET.fromstring(sample)
    attributes = biosample_node.find('Attributes')
    if attributes is not None:
        if len(attributes) >= min_count:
            return True
    return False


def has_minimum_relevant_attributes_count(sample, min_count=2):
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
                attribute_name = att.get('attribute_name')
                display_name = att.get('display_name')
                harmonized_name = att.get('harmonized_name')
                value = None
                if attribute_name in relevant_att_names:
                    value = ncbi_util.extract_ncbi_attribute_value(att, attribute_name)
                elif display_name in relevant_att_names:
                    value = ncbi_util.extract_ncbi_attribute_value(att, display_name)
                elif harmonized_name in relevant_att_names:
                    value = ncbi_util.extract_ncbi_attribute_value(att, harmonized_name)

                # Check if the value is valid
                if value is not None and ncbi_util.is_valid_value(value):
                    matches = matches + 1

            if matches >= min_count:
                return True
            else:
                return False
        else:
            return False
    else:
        return False


def filter_samples():
    if not os.path.exists(os.path.dirname(OUTPUT_FILE)):
        os.makedirs(os.path.dirname(OUTPUT_FILE))
    print('Input file: ' + INPUT_FILE)
    print('Processing NCBI samples...')
    # Read biosamples from XML file
    content = pulldom.parse(gzip.open(INPUT_FILE))
    processed_samples_count = 0
    selected_samples_count = 0
    with codecs.open(OUTPUT_FILE, 'w', 'utf-8') as f:
        f.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n")
        f.write("<BioSampleSet>")
        for event, node in content:
            if event == 'START_ELEMENT' and node.tagName == 'BioSample':
                content.expandNode(node)
                node_xml = node.toxml()
                processed_samples_count = processed_samples_count + 1
                if processed_samples_count % 5000 == 0:
                    print('Processed samples: ' + str(processed_samples_count))
                    print('Selected samples: ' + str(selected_samples_count))
                if is_homo_sapiens_sample(node_xml):
                    if has_minimum_relevant_attributes_count(node_xml, constants.NCBI_FILTER_MIN_RELEVANT_ATTS):
                        f.write('\n' + node.toxml())
                        selected_samples_count = selected_samples_count + 1

        f.write("\n</BioSampleSet>\n")
    f.close()

    print('Finished processing NCBI samples')
    print('- Total samples processed: ' + str(processed_samples_count))
    print('- Total samples selected: ' + str(selected_samples_count))


def main():
    if os.path.exists(OUTPUT_FILE):
        if util.confirm("The destination file already exist. Do you want to overwrite it [y/n]?"):
            filter_samples()
    else:
        filter_samples()


if __name__ == "__main__": main()
