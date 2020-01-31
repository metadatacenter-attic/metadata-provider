#!/usr/bin/python3

# CEDAR utilities

import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning
import json
import urllib.parse
import os
from fnmatch import fnmatch

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)


def get_value_recommendation(server, template_id, target_field_path, populated_fields, api_key, strict_match=False):
    url = server + "/command/recommend"

    if template_id is not None:
        if populated_fields is not None:
            payload = {'templateId': template_id, 'targetField': {'fieldPath': target_field_path},
                       'populatedFields': populated_fields}
        else:
            payload = {'templateId': template_id, 'targetField': {'fieldPath': target_field_path}}

    else:  # template_id is None
        if populated_fields is not None:
            payload = {'targetField': {'fieldPath': target_field_path},
                       'populatedFields': populated_fields}
        else:
            payload = {'targetField': {'fieldPath': target_field_path}}

    payload['strictMatch'] = strict_match

    headers = {
        'content-type': "application/json",
        'authorization': "apiKey " + api_key
    }

    recommendation_response = requests.post(url, json=payload, headers=headers, verify=False)
    print(payload)
    print('------------')
    print(recommendation_response.url)
    print(recommendation_response.text)
    return json.loads(recommendation_response.text)


def save_to_folder(instance, instance_number, output_path, output_base_file_name):
    """
    Saves an instance to a local folder
    :param instance:
    :param instance_number: Number used to name the output files
    :param output_path:
    :param output_base_file_name:
    """
    output_file_path = output_path + "/" + output_base_file_name + "_" + str(instance_number) + '.json'

    with open(output_file_path, 'w') as output_file:
        json.dump(instance, output_file, indent=4)
