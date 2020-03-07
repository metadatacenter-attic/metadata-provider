#!/usr/bin/python3

import scripts.constants as constants
import scripts.util.export_utils as export_utils

SAMPLES_INPUT_FILE = constants.NCBI_EXPORT_INPUT_FILE
SAMPLES_OUTPUT_FILE = constants.NCBI_EXPORT_JSON_OUTPUT_FILE
PROJECTS_INPUT_FILE = constants.BIOPROJECT_OUTPUT_FILE_DICT

INSERT_BIOPROJECT_INFO = True;


def main():
    export_utils.transform_and_export_samples_to_json(constants.ROOT_FOLDER_NAME,
                                                      SAMPLES_INPUT_FILE, SAMPLES_OUTPUT_FILE, INSERT_BIOPROJECT_INFO,
                                                      PROJECTS_INPUT_FILE, 10000)


if __name__ == "__main__":
    main()
