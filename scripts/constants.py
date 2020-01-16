#!/usr/bin/python3

import scripts.util.utils as utils

ROOT_FOLDER_NAME = 'cedar-translator-demo'
BASE_FOLDER = utils.get_base_folder(ROOT_FOLDER_NAME)

# Resources
RESOURCES_FOLDER = BASE_FOLDER + '/' + 'resources'

# Workspace
WORKSPACE_FOLDER = BASE_FOLDER + '/' + 'workspace'
SAMPLES_FOLDER = 'samples'
SOURCE_SAMPLES_FOLDER = 'source'
FILTERED_SAMPLES_FOLDER = 'filtered'
SAMPLES_ANALYSIS_FOLDER = 'analysis'

# Data download
NCBI_DOWNLOAD_URL = 'https://ftp.ncbi.nih.gov/biosample/biosample_set.xml.gz'
NCBI_SAMPLES_FOLDER_DEST = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + SOURCE_SAMPLES_FOLDER
NCBI_SAMPLES_FILE_DEST = 'biosample_set.xml.gz'

# Filter - homo sapiens
NCBI_FILTER_INPUT_FILE = NCBI_SAMPLES_FOLDER_DEST + '/' + NCBI_SAMPLES_FILE_DEST
NCBI_FILTER_OUTPUT_FOLDER = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + FILTERED_SAMPLES_FOLDER
NCBI_FILTER_HOMO_SAPIENS_OUTPUT_FILE = NCBI_FILTER_OUTPUT_FOLDER + '/homo_sapiens/' + 'biosample_filtered.xml'

# Analysis of attribute names in homo sapiens samples
NCBI_ANALYSIS_INPUT_FILE = NCBI_FILTER_HOMO_SAPIENS_OUTPUT_FILE
NCBI_ANALYSIS_OUTPUT_FOLDER = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + SAMPLES_ANALYSIS_FOLDER
NCBI_ANALYSIS_OUTPUT_FILE_ATTRIBUTE_NAMES = NCBI_ANALYSIS_OUTPUT_FOLDER + '/' + 'attribute_names.csv'
NCBI_ANALYSIS_OUTPUT_FILE_DISPLAY_NAMES = NCBI_ANALYSIS_OUTPUT_FOLDER + '/' + 'display_names.csv'
NCBI_ANALYSIS_OUTPUT_FILE_HARMONIZED_NAMES = NCBI_ANALYSIS_OUTPUT_FOLDER + '/' + 'harmonized_names.csv'
NCBI_ANALYSIS_OUTPUT_FILE_ALL_NAMES = NCBI_ANALYSIS_OUTPUT_FOLDER + '/' + 'all_names.csv'

# Filter - homo sapiens and relevant attributes
NCBI_FILTER_HS_AND_ATTS_OUTPUT_FILE = NCBI_FILTER_OUTPUT_FOLDER + '/hs_and_atts/' + 'biosample_filtered.xml'

NCBI_FILTER_RELEVANT_ATTS_1 = \
    [{"name": "sex", "variations": ["sex", "cell sex", "patient gender", "donor gender"]},
    {"name": "tissue", "variations": ["tissue", "tissue supergroup", "tissue source", "metastatic tissue",
                                      "DiseaseLocation", "tissue subtype"]},
    {"name": "disease", "variations": ["disease", "diseaseseverity", "disease staging", "DiseaseStaging",
                                       "clincial information - disease outcome", "original disease abbreviation",
                                       "original disease annotation", "disease group"]}]

# NCBI_FILTER_RELEVANT_ATTS = [
#     {"name": "age", "variations": ["age"]},
#     {"name": "sex", "variations": ["sex"]},
#     {"name": "tissue", "variations": ["tissue"]},
#     {"name": "disease", "variations": ["disease"]},
#     {"name": "cell type", "variations": ["cell type", "cell_type"]},
#     {"name": "cell line", "variations": ["cell line", "cell_line"]}
# ]

# Instances generation
NCBI_INSTANCES_TRAINING_SET_SIZE = 222797 # 85% of 262,114
NCBI_INSTANCES_TESTING_SET_SIZE = 39317 # 15% of 262,114
NCBI_INSTANCES_MAX_FILES_PER_FOLDER = 10000
#NCBI_INSTANCES_INPUT_PATH = NCBI_FILTER_OUTPUT_FILE
NCBI_INSTANCES_OUTPUT_BASE_PATH = WORKSPACE_FOLDER + '/cedar_instances/ncbi_cedar_instances'
NCBI_INSTANCES_TRAINING_BASE_PATH = NCBI_INSTANCES_OUTPUT_BASE_PATH + '/training'
NCBI_INSTANCES_TESTING_BASE_PATH = NCBI_INSTANCES_OUTPUT_BASE_PATH + '/testing'
NCBI_INSTANCES_EXCLUDE_IDS = False
NCBI_INSTANCES_EXCLUDED_IDS_FILE_PATH = RESOURCES_FOLDER + 'excluded_ids.txt'
NCBI_INSTANCES_OUTPUT_BASE_FILE_NAME = 'ncbi_biosample_instance'
NCBI_INSTANCES_EMPTY_BIOSAMPLE_INSTANCE_PATH = RESOURCES_FOLDER + '/cedar_artifacts/ncbi_biosample_empty_instance.json'
