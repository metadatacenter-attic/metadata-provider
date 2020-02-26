#!/usr/bin/python3

# Utility to annotate samples with ontology terms

import scripts.constants as constants
import scripts.annotation.samples_annotator as annotator
import scripts.util.utils as utils
import time

INPUT_FILE = constants.ANNOTATION_INPUT_FILE
OUTPUT_FILE = constants.ANNOTATION_OUTPUT_FILE
PREFERRED_TERMS_FOR_ATT_NAMES = constants.ANNOTATION_PREFERRED_TERMS_FOR_ATT_NAMES
PREFERRED_ONTOLOGIES_FOR_ATT_VALUES = constants.ANNOTATION_PREFERRED_ONTOLOGIES_FOR_ATT_VALUES_1
REGENERATE_ANNOTATION_CACHE = False

# Note that the evaluation file will only be generated if the cache is generated
EVALUATION_INFO_FILE = constants.ANNOTATION_EVALUATION_INFO_FILE


def main():
    start_time = time.time()
    print("Using existing annotation cache? " + ('Yes' if REGENERATE_ANNOTATION_CACHE is False else 'No'))
    annotator.annotate_samples(INPUT_FILE, OUTPUT_FILE,
                               constants.NCBI_ATT_NAMES_VALUES_VARIATIONS, constants.ANNOTATION_FILTER_SPECS,
                               PREFERRED_TERMS_FOR_ATT_NAMES, PREFERRED_ONTOLOGIES_FOR_ATT_VALUES,
                               constants.ANNOTATION_CACHE_FILE, EVALUATION_INFO_FILE, REGENERATE_ANNOTATION_CACHE)
    print("Execution time: %s seconds" % (time.time() - start_time))


if __name__ == "__main__":
    main()
