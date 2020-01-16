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
    :param required_attributes: list of relevant attributes and synonyms that can be used to refer to each of them. Example:
        [{"name": "age", "synonyms": []},
         {"name": "sex", "synonyms": []}]
    :return: Boolean
    """
    # Array with all the variations for all the sample attributes (e.g., ["age", "sex", "cell line", "cell_line"]
    sample_att_names = []
    biosample_node = ET.fromstring(sample)
    sample_atts = biosample_node.find('Attributes')
    if sample_atts is not None:
        for sample_att in sample_atts:
            attribute_name = sample_att.get('attribute_name')
            # display_name = sample_att.get('display_name')
            harmonized_name = sample_att.get('harmonized_name')

            if attribute_name is not None:
                sample_att_names.append(attribute_name)
            # if display_name is not None:
            #     sample_att_names.append(display_name)
            if harmonized_name is not None:
                sample_att_names.append(harmonized_name)

        # Check if the sample contains all the required attributes
        for required_att in required_attributes:
            found = False
            for variation in required_att["variations"]:
                if variation in sample_att_names:
                    found = True
                    break

            # required attribute not found
            if not found:
                return False

        # all the required attributes were found
        return True


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
        req_atts = []
        for required_att in required_attributes:
            req_atts.append(required_att['name'])
        print('Required attributes: ' + str(req_atts))
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
                    break;

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
