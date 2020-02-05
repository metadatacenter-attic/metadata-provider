#!/usr/bin/python3

# Utilities to access BioSample samples in json format


def get_attributes(sample):
    attributes = sample['attributes']
    return attributes

def get_attribute_name(attribute):
    return attribute['attributeName']

def get_attribute_value(attribute):
    return attribute['attributeValue']
