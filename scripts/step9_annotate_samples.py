#!/usr/bin/python3

# Annotates samples

import scripts.constants as constants
import scripts.annotation.samples_annotator as annotator


def main():
    annotator.annotate_samples(constants.ANNOTATION_INPUT_FILE, constants.ANNOTATION_OUTPUT_FILE)


if __name__ == "__main__":
    main()
