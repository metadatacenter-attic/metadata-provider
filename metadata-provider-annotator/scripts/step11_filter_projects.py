#!/usr/bin/python3

# Utility to generates an output XML file with all the BioProjects.

import os
import scripts.constants as constants
import scripts.util.utils as utils
import scripts.util.export_utils as export_utils

INPUT_FILE = constants.BIOPROJECT_INPUT_FILE
OUTPUT_FILE = constants.BIOPROJECT_OUTPUT_FILE


def main():
    constants.BASE_FOLDER = utils.get_base_folder(constants.ROOT_FOLDER_NAME)
    execute = True
    if os.path.exists(OUTPUT_FILE):
        if not utils.confirm('The destination file already exist. Do you want to overwrite it [y/n]? '):
            execute = False
    if execute:
        export_utils.transform_and_export_projects_to_json(INPUT_FILE, OUTPUT_FILE)


if __name__ == "__main__":
    main()
