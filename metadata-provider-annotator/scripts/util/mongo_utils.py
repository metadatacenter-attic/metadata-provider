#!/usr/bin/python3

from pymongo import MongoClient
from pymongo.errors import ConnectionFailure


# Utilities to perform diverse operations on a MongoDB database

def save_to_mongo(json_objects_list, mongo_host, mongo_port, db_name, collection_name, delete_existing_docs=False):
    """
    Saves data to MongoDB
    :param json_objects_list:
    :param mongo_host:
    :param mongo_port:
    :param db:
    :param collection:
    :param delete_existing_docs:
    :return:
    """
    try:
        client = MongoClient(host=mongo_host, port=mongo_port)
        db = client[db_name] # database
        collection = db[collection_name] # collection
        print("Connection to MongoDB was successful!")
        # Delete existing data (optional)
        if delete_existing_docs:
            print("Deleting all documents in the %s collection..." % collection_name)
            result = collection.delete_many({})
            print(result.deleted_count, "documents deleted")

        # Insert new data
        print("Inserting %s documents in the %s collection..." % (str(len(json_objects_list)), collection_name))
        result = collection.insert_many(json_objects_list)
        print(str(len(result.inserted_ids)), "documents inserted")
        client.close()
    except ConnectionFailure as e:
        print("Could not connect to server: %s" % e)