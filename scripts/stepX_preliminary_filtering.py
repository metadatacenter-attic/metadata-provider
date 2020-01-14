#!/usr/bin/python3

# Utility to filter NCBI biosamples based on different criteria. It generates an output XML file with all the selected biosamples

import codecs
import xml.dom.pulldom as pulldom

import os
import constants

import gzip
import util

INPUT_FILE = constants.NCBI_FILTER_INPUT_FILE
OUTPUT_FILE = constants.NCBI_FILTER_OUTPUT_FILE





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
                    # Check if the sample contains all the attributes in the list
                    min_count = len(constants.NCBI_FILTER_RELEVANT_ATTS)
                    if has_minimum_relevant_attributes_count(node_xml, min_count):
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
