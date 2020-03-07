#!/usr/bin/python3

import scripts.constants as constants
import scripts.util.export_utils as export_utils

PROJECTS_INPUT_FILE = constants.BIOPROJECT_INPUT_FILE
PROJECTS_OUTPUT_FILE = constants.BIOPROJECT_OUTPUT_FILE
PROJECTS_OUTPUT_FILE_DICTIONARY = constants.BIOPROJECT_OUTPUT_FILE_DICT
GENERATE_DICT = True


def main():
    export_utils.transform_and_export_projects_to_json(PROJECTS_INPUT_FILE, PROJECTS_OUTPUT_FILE, GENERATE_DICT,
                                                       PROJECTS_OUTPUT_FILE_DICTIONARY)


if __name__ == "__main__":
    main()
