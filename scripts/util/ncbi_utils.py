#!/usr/bin/python3

# Utilities to perform diverse operations on NCBI samples


def is_valid_value(value):
    if value is None:
        return False
    else:
        invalid_values = ['na', 'n/a', 'not applicable', '?', '-', '--', 'unknown', 'missing', 'not collected',
                          'none', 'normal']
        value = value.lower().strip()
        if value not in invalid_values:
            return True
        else:
            # print('invalid value: ' + value)
            return False


def normalize_attribute_name(attribute_name):
    import re
    if attribute_name is not None:
        normalized_attribute_name = re.sub('[^A-Za-z0-9]+', ' ', attribute_name).lower().strip()
        return normalized_attribute_name
    else:
        return None


# def extract_ncbi_attribute_value(attribute_node, attribute_name):
#     """
#     It extracts the attribute value from a BioSample attribute XML node
#     :param attribute_node:
#     :param attribute_name:
#     :return: The attribute value
#     """
#     value = None
#     if attribute_node.get('attribute_name') == attribute_name \
#             or attribute_node.get('harmonized_name') == attribute_name \
#             or attribute_node.get('display_name') == attribute_name:
#         value = attribute_node.text
#
#     return value
