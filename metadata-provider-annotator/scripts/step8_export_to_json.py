#!/usr/bin/python3

import scripts.constants as constants
import scripts.util.export_utils as export_utils

SAMPLES_INPUT_FILE = constants.NCBI_EXPORT_INPUT_FILE
SAMPLES_OUTPUT_FILE = constants.NCBI_EXPORT_JSON_OUTPUT_FILE

PROJECTS_INPUT_FILE = constants.BIOPROJECT_INPUT_FILE
PROJECTS_OUTPUT_FILE = constants.BIOPROJECT_OUTPUT_FILE

EXPORT_SAMPLES = False
EXPORT_PROJECTS = True


def main():
    if EXPORT_SAMPLES:
        export_utils.transform_and_export_samples_to_json(constants.ROOT_FOLDER_NAME,
                                                          SAMPLES_INPUT_FILE, SAMPLES_OUTPUT_FILE, 10000)
    if EXPORT_PROJECTS:
        export_utils.transform_and_export_projects_to_json(PROJECTS_INPUT_FILE, PROJECTS_OUTPUT_FILE)


if __name__ == "__main__":
    main()
