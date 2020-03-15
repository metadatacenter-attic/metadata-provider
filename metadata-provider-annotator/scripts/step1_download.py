#!/usr/bin/python3

# Utility to download the most recent NCBI biosamples and bioprojects to the workspace
import os
import urllib.request
import scripts.constants as constants
import scripts.util.utils as utils

DOWNLOAD_SAMPLES = True
DOWNLOAD_PROJECTS = True


def main():
    if DOWNLOAD_SAMPLES:
        print('== Downloading BioSamples ==')
        print('Source URL: ' + constants.NCBI_DOWNLOAD_URL)
        if not os.path.exists(constants.NCBI_SAMPLES_FOLDER_DEST):
            os.makedirs(constants.NCBI_SAMPLES_FOLDER_DEST)
        dest_path = os.path.join(constants.NCBI_SAMPLES_FOLDER_DEST, constants.NCBI_SAMPLES_FILE_DEST)
        print('Destination file: ' + dest_path)
        if os.path.exists(dest_path):
            if utils.confirm("The destination file already exist. Do you want to overwrite it [y/n]? "):
                urllib.request.urlretrieve(constants.NCBI_DOWNLOAD_URL, dest_path, reporthook=utils.log_progress)
        else:
            urllib.request.urlretrieve(constants.NCBI_DOWNLOAD_URL, dest_path, reporthook=utils.log_progress)

    if DOWNLOAD_PROJECTS:
        print('== Downloading BioProject ==')
        print('Source URL: ' + constants.BIOPROJECT_DOWNLOAD_URL)
        if not os.path.exists(constants.BIOPROJECT_FOLDER_DEST):
            os.makedirs(constants.BIOPROJECT_FOLDER_DEST)
        dest_path = os.path.join(constants.BIOPROJECT_FOLDER_DEST, constants.BIOPROJECT_FILE_DEST)
        print('Destination file: ' + dest_path)
        if os.path.exists(dest_path):
            if utils.confirm("The destination file already exist. Do you want to overwrite it [y/n]? "):
                urllib.request.urlretrieve(constants.BIOPROJECT_DOWNLOAD_URL, dest_path, reporthook=utils.log_progress)
        else:
            urllib.request.urlretrieve(constants.BIOPROJECT_DOWNLOAD_URL, dest_path, reporthook=utils.log_progress)


if __name__ == "__main__":
    main()

