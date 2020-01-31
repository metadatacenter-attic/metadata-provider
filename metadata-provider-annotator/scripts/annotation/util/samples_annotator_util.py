#!/usr/bin/python3

import scripts.util.biosample_json_utils as biosample_json_utils
import scripts.util.utils as utils


def is_relevant_attribute(att_name, att_names_values_variations):
    for att in att_names_values_variations:
        if att_name == att['att_name']:
            return True
        else:
            for att_var in att['att_name_variations']:
                if att_name == att_var:
                    return True
    return False


# def extract_unique_attribute_names(samples, att_names_values_variations):
#     """
#     Extract the raw attribute names
#     :param samples:
#     :return: list of attribute names
#     """
#     unique_att_names = []
#     for sample in samples:
#         sample_attributes = biosample_json_utils.get_attributes(sample)
#         for att in sample_attributes:
#             att_name = biosample_json_utils.get_attribute_name(att)
#             if is_relevant_attribute(att_name, att_names_values_variations):
#                 if att_name not in unique_att_names:
#                     unique_att_names.append(att_name)
#     return unique_att_names


def extract_unique_attribute_names_values(samples, att_names_values_variations):
    """
    Extracts the raw attribute names and their values
    :param samples:
    :return: dictionary of attribute names and a list of attribute value for each of them, that is:
    {
    "att_name1": ["unique_value11", "unique_value12", ...]
    "att_name2": ["unique_value21", "unique_value22", ...]
    }
    """
    unique_att_values = {}
    for sample in samples:
        sample_attributes = biosample_json_utils.get_attributes(sample)
        for att in sample_attributes:
            att_name = biosample_json_utils.get_attribute_name(att)
            if is_relevant_attribute(att_name, att_names_values_variations):
                if att_name not in unique_att_values:
                    unique_att_values[att_name] = []
                att_value = biosample_json_utils.get_attribute_value(att)
                if att_value not in unique_att_values[att_name]:
                    unique_att_values[att_name].append(att_value)
    return unique_att_values


def normalize_term(term, norm_terms = None):
    """
    Normalizes a term to ensure that the NCBO Annotator is able to annotate it
    :param term:
    :param norm_terms: Custom normalized values to help improve the annotation results
    :return:
    """
    if norm_terms is not None and term in norm_terms and len(norm_terms[term]) > 0:
        return norm_terms[term]
    else:
        term = utils.camel_case_to_space_delimited(term)
        term = term.strip()
        term = term.lower()
        term = term.replace('_', ' ')
        term = term.replace('uberon:', '')
        return term
