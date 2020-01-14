#!/usr/bin/python3

# Utility to download the most recent NCBI biosamples to the workspace
import os
import urllib.request
import scripts.constants as c
import scripts.util.utils as utils


def main():
    print('Source URL: ' + c.NCBI_DOWNLOAD_URL)
    if not os.path.exists(c.NCBI_SAMPLES_FOLDER_DEST):
        os.makedirs(c.NCBI_SAMPLES_FOLDER_DEST)
    dest_path = os.path.join(c.NCBI_SAMPLES_FOLDER_DEST, c.NCBI_SAMPLES_FILE_DEST)
    print('Destination file: ' + dest_path)
    if os.path.exists(dest_path):
        if utils.confirm("The destination file already exist. Do you want to overwrite it [y/n]?"):
            urllib.request.urlretrieve(c.NCBI_DOWNLOAD_URL, dest_path, reporthook=utils.log_progress)
    else:
        urllib.request.urlretrieve(c.NCBI_DOWNLOAD_URL, dest_path, reporthook=utils.log_progress)


if __name__ == "__main__": main()

