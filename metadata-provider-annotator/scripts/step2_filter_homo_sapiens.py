#!/usr/bin/python3

# Utility to filter NCBI biosamples based on different criteria.
# It generates an output XML file with all the selected biosamples.

import os
import scripts.constants as constants
import scripts.util.utils as utils
import scripts.util.filter_utils as filter_utils

INPUT_FILE = constants.NCBI_FILTER_INPUT_FILE
OUTPUT_FILE = constants.NCBI_FILTER_HOMO_SAPIENS_OUTPUT_FILE


def main():
    constants.BASE_FOLDER = utils.get_base_folder(constants.ROOT_FOLDER_NAME)
    execute = True
    if os.path.exists(OUTPUT_FILE):
        if not utils.confirm('The destination file already exist. Do you want to overwrite it [y/n]? '):
            execute = False
    if execute:
        filter_utils.filter_samples(INPUT_FILE, OUTPUT_FILE, True, False)


if __name__ == "__main__":
    main()
