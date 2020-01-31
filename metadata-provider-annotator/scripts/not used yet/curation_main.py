#!/usr/bin/python3

# curation_main.py: Utility to perform automatic curation of metadata records

import argparse

import curation_util
import curation_constants


def main():

    parser = argparse.ArgumentParser()

    parser.add_argument("--cedar-api-key",
                        dest='cedar_api_key',
                        required=True,
                        nargs=1,
                        metavar=("CEDAR_API_KEY"),
                        help="Your CEDAR API key")

    args = parser.parse_args()
    api_key = args.cedar_api_key[0]
    target_field_path = 'disease'
    # populated_fields = [{
    #     #     'fieldPath': 'tissue',
    #     #     'fieldValueLabel': 'prostate'
    #     # }]
    populated_fields = []

    response = curation_util.get_value_recommendation(curation_constants.SERVER, curation_constants.TEMPLATE_ID,
                                                 target_field_path, populated_fields, api_key, strict_match=False)

    print(response)

if __name__ == "__main__": main()
