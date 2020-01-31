#!/usr/bin/python3

# Annotates samples

import scripts.constants as constants
import scripts.annotation.samples_annotator as annotator


def main():
    annotator.annotate_samples(constants.ANNOTATION_INPUT_FILE, constants.ANNOTATION_OUTPUT_FILE,
                               constants.NCBI_ATT_NAMES_VALUES_VARIATIONS, constants.ANNOTATION_FILTER_SPECS,
                               constants.ANNOTATION_CACHE_FILE)


if __name__ == "__main__":
    main()
