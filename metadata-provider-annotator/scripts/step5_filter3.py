#!/usr/bin/python3

import scripts.constants as constants
import scripts.util.filter_utils as filter_utils

INPUT_FILE = constants.NCBI_FILTER_1_OUTPUT_FILE
OUTPUT_FILE = constants.NCBI_FILTER_3_OUTPUT_FILE
FILTER_SPECS = constants.NCBI_FILTER_3_SPECS


def main():
    filter_utils.filter_samples_by_attributes(constants.ROOT_FOLDER_NAME, INPUT_FILE, OUTPUT_FILE, FILTER_SPECS,
                                              constants.NCBI_ATT_NAMES_VALUES_VARIATIONS, 10000)


if __name__ == "__main__":
    main()
