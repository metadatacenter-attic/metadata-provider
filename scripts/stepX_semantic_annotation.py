#!/usr/bin/python3

# Annotates a CSV file using ontology terms

import scripts.constants as constants
import scripts.annotation.annotator as annotator

INPUT_FILE = constants.ANNOTATION_INPUT_FILE
OUTPUT_FILE = constants.ANNOTATION_OUTPUT_FILE


def main():
    annotator.annotate_csv(INPUT_FILE, OUTPUT_FILE)


if __name__ == "__main__":
    main()
