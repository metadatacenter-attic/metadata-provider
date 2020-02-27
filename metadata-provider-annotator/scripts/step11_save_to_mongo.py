#!/usr/bin/python3

# Saves both the non-annotated samples and the annotated samples to two different collections in MongoDB

import os

dirpath = os.getcwd()
print("current directory is : " + dirpath)
foldername = os.path.basename(dirpath)
print("Directory name is : " + foldername)

import util.mongo_utils as mongo_utils
import constants
import json


def main():
    # Store filtered, non-annotated samples to MongoDB
    with open(constants.ORIGINAL_SAMPLES_FILE_PATH) as json_file:
        original_samples = json.load(json_file)

    mongo_utils.save_to_mongo(original_samples, constants.MONGO_HOST, constants.MONGO_PORT,
                              constants.MONGO_DB, constants.MONGO_COLLECTION_BIOSAMPLE_ORIGINAL,
                              delete_existing_docs=True)

    # Store filtered, annotated samples to MongoDB
    with open(constants.ANNOTATED_SAMPLES_FILE_PATH) as json_file:
        annotated_samples = json.load(json_file)

    mongo_utils.save_to_mongo(annotated_samples, constants.MONGO_HOST, constants.MONGO_PORT,
                              constants.MONGO_DB, constants.MONGO_COLLECTION_BIOSAMPLE_ANNOTATED,
                              delete_existing_docs=True)


if __name__ == "__main__":
    main()
