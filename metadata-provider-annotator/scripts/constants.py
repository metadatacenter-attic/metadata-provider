#!/usr/bin/python3

import scripts.util.utils as utils
import os

ROOT_FOLDER_NAME = 'metadata-provider-annotator'
BASE_FOLDER = utils.get_base_folder(ROOT_FOLDER_NAME)

# Resources
RESOURCES_FOLDER = BASE_FOLDER + '/' + 'resources'

# Workspace
WORKSPACE_FOLDER = BASE_FOLDER + '/' + 'workspace'
SAMPLES_FOLDER = 'samples'
PROJECTS_FOLDER = 'projects'
SOURCE_SAMPLES_FOLDER = 'source'
FILTERED_SAMPLES_FOLDER = 'filtered'
SAMPLES_ANALYSIS_FOLDER = 'analysis'
EXPORT_FOLDER = 'exported'
ANNOTATED_SAMPLES_FOLDER = 'annotated'

# BioPortal Annotator
BIOPORTAL_APIKEY = os.environ['NCATS_TRANSLATOR_BIOPORTAL_API_KEY']  # You need to define it in your local environment

# Data download
NCBI_DOWNLOAD_URL = 'https://ftp.ncbi.nih.gov/biosample/biosample_set.xml.gz'
NCBI_SAMPLES_FOLDER_DEST = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + SOURCE_SAMPLES_FOLDER
NCBI_SAMPLES_FILE_DEST = 'biosample_set.xml.gz'

BIOPROJECT_DOWNLOAD_URL = 'https://ftp.ncbi.nlm.nih.gov/bioproject/bioproject.xml'
BIOPROJECT_FOLDER_DEST = WORKSPACE_FOLDER + '/' + PROJECTS_FOLDER + '/' + SOURCE_SAMPLES_FOLDER
BIOPROJECT_FILE_DEST = 'bioproject.xml'

# Filter - homo sapiens
NCBI_FILTER_INPUT_FILE = NCBI_SAMPLES_FOLDER_DEST + '/' + NCBI_SAMPLES_FILE_DEST
NCBI_FILTER_OUTPUT_FOLDER = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + FILTERED_SAMPLES_FOLDER
NCBI_FILTER_HOMO_SAPIENS_OUTPUT_FILE = NCBI_FILTER_OUTPUT_FOLDER + '/homo_sapiens/' + 'biosample_filtered.xml'

# Filter - BioProject
BIOPROJECT_INPUT_FILE = BIOPROJECT_FOLDER_DEST + '/' + BIOPROJECT_FILE_DEST
BIOPROJECT_OUTPUT_FOLDER = WORKSPACE_FOLDER + '/' + PROJECTS_FOLDER + '/' + EXPORT_FOLDER
BIOPROJECT_OUTPUT_FILE = BIOPROJECT_OUTPUT_FOLDER + '/' + 'bioproject.json'

# Analysis of attribute names in homo sapiens samples
NCBI_ANALYSIS_INPUT_FILE = NCBI_FILTER_HOMO_SAPIENS_OUTPUT_FILE
NCBI_ANALYSIS_OUTPUT_FOLDER = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + SAMPLES_ANALYSIS_FOLDER
NCBI_ANALYSIS_OUTPUT_FILE_ATTRIBUTE_NAMES = NCBI_ANALYSIS_OUTPUT_FOLDER + '/' + 'attribute_names.csv'
NCBI_ANALYSIS_OUTPUT_FILE_DISPLAY_NAMES = NCBI_ANALYSIS_OUTPUT_FOLDER + '/' + 'display_names.csv'
NCBI_ANALYSIS_OUTPUT_FILE_HARMONIZED_NAMES = NCBI_ANALYSIS_OUTPUT_FOLDER + '/' + 'harmonized_names.csv'
NCBI_ANALYSIS_OUTPUT_FILE_ALL_NAMES = NCBI_ANALYSIS_OUTPUT_FOLDER + '/' + 'all_names.csv'

# Filter - homo sapiens and relevant attributes

# Filtering by different attribute names
NCBI_FILTER_1_SPECS = [{"att_name": "sex", "att_values": []},
                       {"att_name": "tissue", "att_values": []},
                       {"att_name": "disease", "att_values": []}]
NCBI_FILTER_2_SPECS = [{"att_name": "sex", "att_values": []},
                       {"att_name": "tissue", "att_values": []},
                       {"att_name": "disease", "att_values": []},
                       {"att_name": "cell_type", "att_values": []},
                       {"att_name": "cell_line", "att_values": []},
                       {"att_name": "age", "att_values": []}]
NCBI_FILTER_3_SPECS = [{"att_name": "sex", "att_values": []},
                       {"att_name": "tissue", "att_values": []},
                       {"att_name": "disease", "att_values": []},
                       {"att_name": "cell_type", "att_values": []}]
NCBI_FILTER_4_SPECS = [{"att_name": "sex", "att_values": []},
                       {"att_name": "tissue", "att_values": []},
                       {"att_name": "disease", "att_values": []},
                       {"att_name": "cell_line", "att_values": []}]
NCBI_FILTER_5_SPECS = [{"att_name": "sex", "att_values": []},
                       {"att_name": "tissue", "att_values": []},
                       {"att_name": "disease", "att_values": []},
                       {"att_name": "age", "att_values": []}]

NCBI_FILTER_1_OUTPUT_FILE = NCBI_FILTER_OUTPUT_FOLDER + '/filter1/' + 'biosample_filtered.xml'
NCBI_FILTER_2_OUTPUT_FILE = NCBI_FILTER_OUTPUT_FOLDER + '/filter2/' + 'biosample_filtered.xml'
NCBI_FILTER_3_OUTPUT_FILE = NCBI_FILTER_OUTPUT_FOLDER + '/filter3/' + 'biosample_filtered.xml'
NCBI_FILTER_4_OUTPUT_FILE = NCBI_FILTER_OUTPUT_FOLDER + '/filter4/' + 'biosample_filtered.xml'
NCBI_FILTER_5_OUTPUT_FILE = NCBI_FILTER_OUTPUT_FOLDER + '/filter5/' + 'biosample_filtered.xml'

# Filtering by attribute names and values
NCBI_FILTER_6_SPECS = [{"att_name": "sex", "att_values": []},
                       {"att_name": "tissue", "att_values": []},
                       {"att_name": "race", "att_values": []},
                       {"att_name": "disease", "att_values": ["liver_cancer"]}]

NCBI_FILTER_6_OUTPUT_FILE = NCBI_FILTER_OUTPUT_FOLDER + '/filter6/' + 'biosample_filtered.xml'

# The attribute name variations include the harmonized name for the attribute (first item in the array) plus all the
# non-harmonized variations. Harmonized variations (e.g., 'gender' for the attribute 'sex') don't need to be included
# because we will perform a comparison against the harmonized attribute name (that is, 'sex' in the previous example)
NCBI_ATT_NAMES_VALUES_VARIATIONS = [
  {
    "att_name": "sex",
    "att_name_variations": [
      "sex",
      "cell sex",
      "patient gender",
      "donor gender"
    ],
    "att_values": []
  },
  {
    "att_name": "disease",
    "att_name_variations": [
      "disease",
      "diseaseseverity",
      "diseaseSeverity",
      "disease staging",
      "DiseaseStaging",
      "clincial information - disease outcome",
      "original disease abbreviation",
      "original disease annotation",
      "disease group"
    ],
    "att_values": [
      {
        "att_value": "liver_cancer",
        "att_value_variations": [
          "liver_cancer",
          "liver cancer",
          "liver carcinoma"
          "hepatic cancer",
          "liver tumour",
          "liver tumor",
          "Liver and Intrahepatic bile duct carcinoma",
          "hepatocellular carcinoma",
          "hcc",
          "hepatoma",
          "malignant hepatoma",
          "hepatocarcinoma",
          "cancer of the liver"
        ]
      }
    ]
  },
  {
    "att_name": "tissue",
    "att_name_variations": [
      "tissue",
      "tissue supergroup",
      "tissue source",
      "metastatic tissue",
      "DiseaseLocation",
      "tissue subtype"
    ],
    "att_values": []
  },
  {
    "att_name": "cell_line",
    "att_name_variations": [
      "cell_line"
    ],
    "att_values": []
  },
  {
    "att_name": "cell_type",
    "att_name_variations": [
      "cell_type"
    ],
    "att_values": []
  },
  {
    "att_name": "race",
    "att_name_variations": [],
    "att_values": []
  },
  {
    "att_name": "age",
    "att_name_variations": [
      "age"
    ],
    "att_values": []
  }
]

# Export samples to other formats #
NCBI_EXPORT_INPUT_FILE = NCBI_FILTER_OUTPUT_FOLDER + '/filter6/' + '20200117-141930_biosample_filtered_834.xml'
NCBI_EXPORT_CSV_OUTPUT_FILE = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + EXPORT_FOLDER + '/csv/' + 'biosample_exported.csv'
# export sex, tissue, and disease, with all their values. This is only used for the CSV export, to simplify analysis
NCBI_EXPORT_FILTER_SPECS = [{"att_name": "sex", "att_values": []},
                            {"att_name": "tissue", "att_values": []},
                            {"att_name": "disease", "att_values": []}]

# Export to JSON
NCBI_EXPORT_JSON_OUTPUT_FILE = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + EXPORT_FOLDER + '/json/' + 'biosample_exported.json'

# Analysis of attribute values in the CSV
NCBI_ANALYSIS_VALUES_INPUT_FILE = NCBI_EXPORT_CSV_OUTPUT_FILE

# Semantic annotation
ANNOTATION_INPUT_FILE = NCBI_EXPORT_JSON_OUTPUT_FILE # original (non-annotated) samples
ANNOTATION_OUTPUT_FILE = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + ANNOTATED_SAMPLES_FOLDER \
                         + '/' + 'biosample_annotated.json'
ANNOTATION_NORMALIZED_ATT_NAMES_FILE = RESOURCES_FOLDER + '/annotation/normalized_att_names.json'
ANNOTATION_NORMALIZED_ATT_VALUES_FILE = RESOURCES_FOLDER + '/annotation/normalized_att_values.json'

ANNOTATION_CACHE_FILE = RESOURCES_FOLDER + '/annotation/annotation_cache.json'

ANNOTATION_FILTER_SPECS = [{"att_name": "sex"},
                            {"att_name": "tissue"},
                            {"att_name": "disease"}]

# Save samples to Mongo
ORIGINAL_SAMPLES_FILE_PATH = NCBI_EXPORT_JSON_OUTPUT_FILE
ANNOTATED_SAMPLES_FILE_PATH = ANNOTATION_OUTPUT_FILE
MONGO_HOST = "localhost"
MONGO_PORT = 27017
MONGO_DB = "ncats-demo"
MONGO_COLLECTION_BIOSAMPLE_ORIGINAL = "biosample-original"
MONGO_COLLECTION_BIOSAMPLE_ANNOTATED = "biosample-annotated"

# # Instances generation
# NCBI_INSTANCES_TRAINING_SET_SIZE = 222797  # 85% of 262,114
# NCBI_INSTANCES_TESTING_SET_SIZE = 39317  # 15% of 262,114
# NCBI_INSTANCES_MAX_FILES_PER_FOLDER = 10000
# # NCBI_INSTANCES_INPUT_PATH = NCBI_FILTER_OUTPUT_FILE
# NCBI_INSTANCES_OUTPUT_BASE_PATH = WORKSPACE_FOLDER + '/cedar_instances/ncbi_cedar_instances'
# NCBI_INSTANCES_TRAINING_BASE_PATH = NCBI_INSTANCES_OUTPUT_BASE_PATH + '/training'
# NCBI_INSTANCES_TESTING_BASE_PATH = NCBI_INSTANCES_OUTPUT_BASE_PATH + '/testing'
# NCBI_INSTANCES_EXCLUDE_IDS = False
# NCBI_INSTANCES_EXCLUDED_IDS_FILE_PATH = RESOURCES_FOLDER + 'excluded_ids.txt'
# NCBI_INSTANCES_OUTPUT_BASE_FILE_NAME = 'ncbi_biosample_instance'
# NCBI_INSTANCES_EMPTY_BIOSAMPLE_INSTANCE_PATH = RESOURCES_FOLDER + '/cedar_artifacts/ncbi_biosample_empty_instance.json'

