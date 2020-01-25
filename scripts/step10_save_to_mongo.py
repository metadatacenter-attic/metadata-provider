#!/usr/bin/python3

# Saves both the non-annotated samples and the annotated samples to two different collections in MongoDB

import scripts.util.mongo_utils as mongo_utils
import scripts.constants as constants
import json


def main():
    # Store filtered, non-annotated samples to MongoDB
    with open(constants.ORIGINAL_SAMPLES_PATH) as json_file:
        original_samples = json.load(json_file)

    mongo_utils.save_to_mongo(original_samples, constants.MONGO_HOST, constants.MONGO_PORT,
                              constants.MONGO_DB, constants.MONGO_COLLECTION_BIOSAMPLE_ORIGINAL,
                              delete_existing_docs=True)
    # Store filtered, annotated samples to MongoDB
    # TODO...


if __name__ == "__main__":
    main()
