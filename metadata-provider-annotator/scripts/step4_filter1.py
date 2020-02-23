#!/usr/bin/python3

import scripts.constants as constants
import scripts.util.filter_utils as filter_utils
import scripts.util.utils as utils

#INPUT_FILE = constants.NCBI_FILTER_HOMO_SAPIENS_OUTPUT_FILE
INPUT_FILE = '/Users/marcosmr/Development/CEDAR/cedar-translator-demo/metadata-provider-annotator/workspace/samples/filtered/homo_sapiens/test.xml'
OUTPUT_FILE = utils.add_timestamp_to_filename(constants.NCBI_FILTER_1_OUTPUT_FILE)
FILTER_SPECS = constants.NCBI_FILTER_1_SPECS


def main():
    filter_utils.filter_samples_by_attributes(constants.ROOT_FOLDER_NAME, INPUT_FILE, OUTPUT_FILE, FILTER_SPECS,
                                              constants.NCBI_ATT_NAMES_VALUES_VARIATIONS, 10000)


if __name__ == "__main__":
    main()
