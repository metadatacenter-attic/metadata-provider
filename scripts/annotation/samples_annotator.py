#!/usr/bin/python3

# Utilities to annotate BioSample samples using ontology terms

import pandas as pd
import os
import scripts.util.utils as utils
import json
import scripts.util.biosample_json_utils as biosample_json_utils


ATT_NAME_TERM_URI = 'att_name_term_uri'
ATT_NAME_TERM_LABEL = 'att_name_term_label'
ATT_NAME_TERM_SOURCE = 'att_name_term_source'
ATT_VALUE_TERM_URI = 'att_value_term_uri'
ATT_VALUE_TERM_LABEL = 'att_value_term_label'
ATT_VALUE_TERM_SOURCE = 'att_value_term_source'


def annotate_attribute_names(sample):
    """

    :param sample:
    :return:
    """
    sample_attributes = biosample_json_utils.get_attributes(sample)
    for att in sample_attributes:
        att_name = biosample_json_utils.get_attribute_name(att)
        # att_value = biosample_json_utils.get_attribute_value(att)
        # print(att_name + '-' + att_value)
        att[ATT_NAME_TERM_URI] = 'name term uri'
        att[ATT_NAME_TERM_LABEL] = 'name term label'
        att[ATT_NAME_TERM_SOURCE] = 'name term source'
    return sample


def annotate_attribute_values(sample):
    """

    :param sample:
    :return:
    """
    sample_attributes = biosample_json_utils.get_attributes(sample)
    for att in sample_attributes:
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


def annotate_samples(input_file, output_file):
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

        annotated_samples = []
        for sample in original_samples:
            annotated_sample = annotate_sample(sample)
            annotated_samples.append(annotated_sample)

        with open(output_file, 'w') as f:
            json.dump(annotated_samples, f)

        print('Finished annotating NCBI samples')
        print('- Total samples processed: ' + str(len(original_samples)))
        print('- Total samples annotated and saved to output file: ' + str(len(annotated_samples)))
