#!/usr/bin/python3

import scripts.util.biosample_json_utils as biosample_json_utils
import scripts.util.utils as utils
import re


def is_relevant_attribute(att_name, att_names_values_variations):
    for att in att_names_values_variations:
        if att_name == att['att_name']:
            return True
        else:
            for att_var in att['att_name_variations']:
                if att_name == att_var:
                    return True
    return False


def extract_unique_attribute_names_values(samples, att_names_values_variations):
    """
    Extracts the raw attribute names and their values, as well as their frequency
    :param samples:
    :return:
    {
    "att_name1": {"unique_value11": frequency_unique_value11, "unique_value12":"frequency_unique_value12, ...]
    "att_name2": {"unique_value21": frequency_unique_value21, "unique_value22":"frequency_unique_value22, ...]
    }
    """
    unique_att_values = {}
    for sample in samples:
        sample_attributes = biosample_json_utils.get_attributes(sample)
        for att in sample_attributes:
            att_name = biosample_json_utils.get_attribute_name(att)
            if is_relevant_attribute(att_name, att_names_values_variations):
                if att_name not in unique_att_values:
                    unique_att_values[att_name] = {}
                att_value = biosample_json_utils.get_attribute_value(att)
                if att_value not in unique_att_values[att_name]:
                    unique_att_values[att_name][att_value] = 1
                else:  # The value is already there. Increment its count
                    unique_att_values[att_name][att_value] += 1
    return unique_att_values


def normalize_term(term, norm_terms = None):
    """
    Basic normalization to ensure that the NCBO Annotator is able to annotate it
    :param term:
    :param norm_terms: Custom normalized values to help improve the annotation results
    :return:
    """
    if norm_terms is not None and term in norm_terms and len(norm_terms[term]) > 0:
        return norm_terms[term]
    else:
        # term = utils.camel_case_to_space_delimited(term)  # We removed this transformation because it's a source of mistakes
        # term = re.sub('([^A-Za-z0-9]+)|(uberon:)', ' ', term) # Errors when normalizing F-36P to F 36p
        term = re.sub(' +', ' ', term)  # Multiple spaces to single space
        term = term.lower().strip()  # To lowercase and strip
        return term


def normalize_term2(term):
    """
    Deeper normalization. It removes all special symbols and spaces
    :param term:
    :return:
    """
    term = re.sub('([^A-Za-z0-9]+)', '', term)  # Errors when normalizing F-36P to F 36p
    term = term.lower()
    return term


def normalize_term_spaces(term):
    term = re.sub(' +', ' ', term)  # Remove spaces
    return term


def normalize_term_caml_case(term):
    """
    Deeper normalization
    :param term:
    :return:
    """
    # term = utils.camel_case_to_space_delimited(term)  # We removed this transformation because it's a source of mistakes
    # term = re.sub('([^A-Za-z0-9]+)|(uberon:)', ' ', term) # Errors when normalizing F-36P to F 36p
    term = re.sub('uberon:', ' ', term)  # Remove uberon: prefix
    term = re.sub(' +', ' ', term)  # Multiple spaces to single space
    term = term.lower().strip()  # To lowercase and strip
    return term



def equal_norm_str(str1, str2):
    """
    Checks if two normalized strings are equal
    :param str1:
    :param str2:
    :return: True if the normalized strings are equal. False otherwise
    """
    if normalize_term(str1) == normalize_term(str2):
        return True
    else:
        return False


def contained_in_list_norm_str(str, str_list):
    """
    Checks if a string is contained in a list of strings. The comparisons are done using normalized strings
    :return: boolean
    """
    if str is None or len(str) == 0 or str_list is None or len(str_list) == 0:
        return False;
    else:
        str_norm = normalize_term(str)
        list_norm = [normalize_term(item) for item in str_list]
        if str_norm in list_norm:
            return True
        else:
            return False
