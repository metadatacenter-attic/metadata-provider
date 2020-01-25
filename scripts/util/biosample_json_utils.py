#!/usr/bin/python3

# Utilities to access BioSample samples in json format

ATT_HARMONIZED_NAME = '@harmonized_name'
ATT_ATTRIBUTE_NAME = '@attribute_name'
ATT_ATTRIBUTE_VALUE = '#text'


def get_attributes(sample):
    attributes = sample['BioSample']['Attributes']['Attribute']
    return attributes


def get_attribute_name(attribute):
    if ATT_HARMONIZED_NAME in attribute and attribute[ATT_HARMONIZED_NAME] is not None:
        return attribute[ATT_HARMONIZED_NAME]
    else:
        return attribute[ATT_ATTRIBUTE_NAME]


def get_attribute_value(attribute):
    return attribute[ATT_ATTRIBUTE_VALUE]
