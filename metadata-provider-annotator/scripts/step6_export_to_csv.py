#!/usr/bin/python3

import scripts.constants as constants
import scripts.util.export_utils as export_utils

INPUT_FILE = constants.NCBI_EXPORT_INPUT_FILE
OUTPUT_FILE = constants.NCBI_EXPORT_CSV_OUTPUT_FILE
EXPORT_FILTER_SPECS = constants.NCBI_EXPORT_FILTER_SPECS


def main():

    export_utils.export_samples_to_csv(constants.ROOT_FOLDER_NAME, INPUT_FILE, OUTPUT_FILE, EXPORT_FILTER_SPECS,
                                              constants.NCBI_ATT_NAMES_VALUES_VARIATIONS, 10000)


if __name__ == "__main__":
    main()
