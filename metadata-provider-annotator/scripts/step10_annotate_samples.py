#!/usr/bin/python3

# Utility to annotate samples with ontology terms

import scripts.constants as constants
import scripts.annotation.samples_annotator as annotator
import time

# General settings
INPUT_FILE = constants.ANNOTATION_INPUT_FILE
OUTPUT_FILE = constants.ANNOTATION_OUTPUT_FILE

# Annotation settings - preferred terms and ontologies
PREFERRED_TERMS_FOR_ATT_NAMES = constants.ANNOTATION_PREFERRED_TERMS_FOR_ATT_NAMES
PREFERRED_ONTOLOGIES_FOR_ATT_VALUES = constants.ANNOTATION_PREFERRED_ONTOLOGIES_FOR_ATT_VALUES

# Annotation settings
REGENERATE_ANNOTATION_CACHE = False
ANNOTATOR_PRIORITIZE_PREF_ANNOTATION = True
USE_ANY_ONTOLOGY_IF_NO_RESULTS = False
IGNORE_INVALID_VALUES = constants.ANNOTATION_IGNORE_VALUES

# Note that the evaluation file will only be generated if the cache is generated
EVALUATION_INFO_FILE = constants.ANNOTATION_EVALUATION_INFO_FILE


def main():
    start_time = time.time()
    print("Using existing annotation cache? " + ('Yes' if REGENERATE_ANNOTATION_CACHE is False else 'No'))
    annotator.annotate_samples(INPUT_FILE, OUTPUT_FILE, ANNOTATOR_PRIORITIZE_PREF_ANNOTATION,
                               USE_ANY_ONTOLOGY_IF_NO_RESULTS, IGNORE_INVALID_VALUES,
                               constants.NCBI_ATT_NAMES_VALUES_VARIATIONS, constants.ANNOTATION_FILTER_SPECS,
                               PREFERRED_TERMS_FOR_ATT_NAMES, PREFERRED_ONTOLOGIES_FOR_ATT_VALUES,
                               constants.ANNOTATION_CACHE_FILE, EVALUATION_INFO_FILE, REGENERATE_ANNOTATION_CACHE)
    print("Execution time: %s seconds" % (time.time() - start_time))


if __name__ == "__main__":
    main()
