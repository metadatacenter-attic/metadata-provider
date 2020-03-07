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

# Results folder
RESULTS_FOLDER = BASE_FOLDER + '/' + 'results'

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
BIOPROJECT_OUTPUT_FILE_DICT = BIOPROJECT_OUTPUT_FOLDER + '/' + 'bioproject_dict.json'

# Analysis of attribute names in homo sapiens samples
NCBI_ANALYSIS_INPUT_FILE = NCBI_FILTER_HOMO_SAPIENS_OUTPUT_FILE
NCBI_ANALYSIS_OUTPUT_FOLDER = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + SAMPLES_ANALYSIS_FOLDER
NCBI_ANALYSIS_OUTPUT_FILE_ATTRIBUTE_NAMES = NCBI_ANALYSIS_OUTPUT_FOLDER + '/' + 'attribute_names.csv'
NCBI_ANALYSIS_OUTPUT_FILE_DISPLAY_NAMES = NCBI_ANALYSIS_OUTPUT_FOLDER + '/' + 'display_names.csv'
NCBI_ANALYSIS_OUTPUT_FILE_HARMONIZED_NAMES = NCBI_ANALYSIS_OUTPUT_FOLDER + '/' + 'harmonized_names.csv'
NCBI_ANALYSIS_OUTPUT_FILE_ALL_NAMES = NCBI_ANALYSIS_OUTPUT_FOLDER + '/' + 'all_names.csv'

# Filter - homo sapiens and relevant attributes

# Filtering by different attribute names and values
NCBI_FILTER_1_SPECS = [{"att_name": "disease",
                        "att_values": ["hepatocellular carcinoma", "myelodysplasia", "systemic lupus erythematosus"]}]
NCBI_FILTER_1_OUTPUT_FILE = NCBI_FILTER_OUTPUT_FOLDER + '/filter1/' + 'biosample_filtered.xml'

# Filter 2: HCC
NCBI_FILTER_2_SPECS = [{"att_name": "disease", "att_values": ["hepatocellular carcinoma"]}]
NCBI_FILTER_2_OUTPUT_FILE = NCBI_FILTER_OUTPUT_FOLDER + '/filters_2_3_4/' + 'biosample_filtered_HCC.xml'

# Filter 3: MDS
NCBI_FILTER_3_SPECS = [{"att_name": "disease", "att_values": ["myelodysplasia"]}]
NCBI_FILTER_3_OUTPUT_FILE = NCBI_FILTER_OUTPUT_FOLDER + '/filters_2_3_4/' + 'biosample_filtered_MDS.xml'

# Filter 4: SLE
NCBI_FILTER_4_SPECS = [{"att_name": "disease", "att_values": ["systemic lupus erythematosus"]}]
NCBI_FILTER_4_OUTPUT_FILE = NCBI_FILTER_OUTPUT_FOLDER + '/filters_2_3_4/' + 'biosample_filtered_SLE.xml'

# Analysis of attribute names after applying filter 1
NCBI_ANALYSIS_ATT_NAMES_FILTER_1_INPUT_FILE = NCBI_FILTER_1_OUTPUT_FILE

# Filter 5: all records with cell lines and disease
NCBI_FILTER_5_SPECS = [{"att_name": "disease", "att_values": []}, {"att_name": "cell line", "att_values": []}]
NCBI_FILTER_5_OUTPUT_FILE = NCBI_FILTER_OUTPUT_FOLDER + '/filter5/' + 'biosample_filtered.xml'


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
            "disease"
        ],
        "att_values": [
            {
                "att_value": "hepatocellular carcinoma",
                "att_value_variations": [
                    "hepatocellular carcinoma",
                    "HCC",
                    "liver cell cancer (hepatocellular carcinoma)",
                    "hepatocellular cancer",
                    "hepatocellular adenocarcinoma",
                    "hepatoma",
                    "hepatocarcinoma"
                ]
            },
            {
                "att_value": "myelodysplasia",
                "att_value_variations": [
                    "myelodysplasia",
                    "MDS",
                    "preleukemia",
                    "smoldering leukemia",
                    "myelodysplastic syndrome/neoplasm",
                    "myelodysplastic neoplasm",
                    "myelodysplastic syndromes",
                    "myelodysplastic syndrome",
                    "myelodysplastic syndrome; MDS",
                    "dysmyelopoietic syndrome",
                    "myelodysplastic syndrome, NOS"
                ]
            },
            {
                "att_value": "systemic lupus erythematosus",
                "att_value_variations": [
                    "systemic lupus erythematosus",
                    "SLE",
                    "SLE - lupus erythematosus systemic"
                ]
            }
        ]
    },
    {
        "att_name": "tissue",
        "att_name_variations": [
            "tissue"
        ],
        "att_values": []
    },
    {
        "att_name": "cell line",
        "att_name_variations": [
            "cell line"
        ],
        "att_values": []
    },
    {
        "att_name": "cell type",
        "att_name_variations": [
            "cell type"
        ],
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
NCBI_EXPORT_INPUT_FILE = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + 'filtered/filter1/biosample_filtered.xml'
NCBI_EXPORT_CSV_OUTPUT_FILE = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + EXPORT_FOLDER + '/csv/' + 'biosample_exported.csv'
# export sex, tissue, and disease, with all their values. This is only used for the CSV export, to simplify analysis
NCBI_EXPORT_FILTER_SPECS = [{"att_name": "disease", "att_values": []},
                            {"att_name": "tissue", "att_values": []},
                            {"att_name": "cell type", "att_values": []},
                            {"att_name": "cell line", "att_values": []},
                            {"att_name": "sex", "att_values": []}]

# Export to JSON
NCBI_EXPORT_JSON_OUTPUT_FILE = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + EXPORT_FOLDER + '/json/' + 'biosample_exported.json'


# Analysis of attribute values in the CSV
NCBI_ANALYSIS_VALUES_INPUT_FILE = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + EXPORT_FOLDER + '/csv/' + 'biosample_exported.csv'
#NCBI_ANALYSIS_VALUES_INPUT_FILE = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + EXPORT_FOLDER + '/csv/' + 'biosample_exported_MDS.csv'
#NCBI_ANALYSIS_VALUES_INPUT_FILE = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + EXPORT_FOLDER + '/csv/' + 'biosample_exported_HCC.csv'
#NCBI_ANALYSIS_VALUES_INPUT_FILE = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + EXPORT_FOLDER + '/csv/' + 'biosample_exported_SLE.csv'

# Semantic annotation
ANNOTATION_IGNORE_VALUES = ['missing', 'unknown', 'not available', 'NA',
                             'not applicable', 'not determined', 'not collected', 'NaN']
ANNOTATION_INPUT_FILE = NCBI_EXPORT_JSON_OUTPUT_FILE  # original (non-annotated) samples
ANNOTATION_OUTPUT_FILE = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + ANNOTATED_SAMPLES_FOLDER \
                         + '/' + 'biosample_annotated.json'
ANNOTATION_NORMALIZED_ATT_NAMES_FILE = RESOURCES_FOLDER + '/annotation/normalized_att_names.json'
ANNOTATION_NORMALIZED_ATT_VALUES_FILE = RESOURCES_FOLDER + '/annotation/normalized_att_values.json'
ANNOTATION_EVALUATION_INFO_FILE = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + ANNOTATED_SAMPLES_FOLDER \
                         + '/' + 'annotation_evaluation_info.json'
#ANNOTATION_EVALUATION_INFO_FILE_REVIEWED = RESULTS_FOLDER + '/2020-02-26_0920/3-annotations_evaluation/annotation_evaluation_info_reviewed.json'
ANNOTATION_EVALUATION_INFO_FILE_REVIEWED = RESULTS_FOLDER + '/2020-02-26_1535/3-annotations_evaluation/annotation_evaluation_info_reviewed.json'
ANNOTATION_EVALUATION_RESULTS_FILE = WORKSPACE_FOLDER + '/' + SAMPLES_FOLDER + '/' + ANNOTATED_SAMPLES_FOLDER \
                         + '/' + 'annotation_evaluation_results.txt'

ANNOTATION_CACHE_FILE = RESOURCES_FOLDER + '/annotation/annotation_cache.json'

ANNOTATION_FILTER_SPECS = [{"att_name": "disease",
                            "att_values": ["hepatocellular carcinoma",
                                           "myelodysplasia",
                                           "systemic lupus erythematosus"]},
                           {"att_name": "tissue", "att_values": []},
                           {"att_name": "cell type", "att_values": []},
                           {"att_name": "cell line", "att_values": []},
                           {"att_name": "sex", "att_values": []}]

ANNOTATION_PREFERRED_TERMS_FOR_ATT_NAMES = {
    "disease": {
        "term-uri": "https://w3id.org/biolink/biolinkml/meta/Disease",
        "term-label": "Disease",
        "term-alt-labels": ["disease status", "disease state"],
        "term-source": "BIOLINK",
    },
    "tissue": {
        "term-uri": "http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C12801",
        "term-label": "Tissue",
        "term-alt-labels": ["body site", "organism part", "tissue type", "source tissue", "tissue origin", "tissue source"],
        "term-source": "NCIT",
    },
    "cell type": {
        "term-uri": "https://w3id.org/biolink/biolinkml/meta/Cell",
        "term-label": "Cell",
        "term-alt-labels": [],
        "term-source": "BIOLINK",
    },
    "cell line": {
        "term-uri": "https://w3id.org/biolink/biolinkml/meta/CellLine",
        "term-label": "Cell line",
        "term-alt-labels": ["cell line name"],
        "term-source": "BIOLINK",
    },
    "sex": {
        "term-uri": "https://w3id.org/biolink/biolinkml/meta/BiologicalSex",
        "term-label": "Biological sex",
        "term-alt-labels": ["gender", "sex", "cell sex", "patient gender", "donor gender"],
        "term-source": "BIOLINK",
    }
}

ANNOTATION_PREFERRED_ONTOLOGIES_FOR_ATT_VALUES = {
    "disease": ["MONDO"],
    "tissue": ["BTO", "UPHENO", "NCIT"],
    "cell type": ["CL", "BTO", "UPHENO"],
    "cell line": ["CLO"],
    "sex": ["PATO"]
}

# Save samples to Mongo
ORIGINAL_SAMPLES_FILE_PATH = NCBI_EXPORT_JSON_OUTPUT_FILE
ANNOTATED_SAMPLES_FILE_PATH = ANNOTATION_OUTPUT_FILE

MONGO_HOST = "localhost"
MONGO_PORT = 27017
MONGO_DB = "ncats-demo"
MONGO_COLLECTION_BIOSAMPLE_ORIGINAL = "biosample-original"
MONGO_COLLECTION_BIOSAMPLE_ANNOTATED = "biosample-annotated"
