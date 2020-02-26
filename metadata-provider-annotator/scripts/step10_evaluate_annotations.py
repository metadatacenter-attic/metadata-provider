#!/usr/bin/python3

# Annotations evaluator

import scripts.constants as constants
import scripts.annotation.samples_annotations_evaluator as evaluator

ANNOTATION_EVALUATION_INFO_FILE = constants.ANNOTATION_EVALUATION_INFO_FILE
ANNOTATION_EVALUATION_RESULTS_FILE = constants.ANNOTATION_EVALUATION_RESULTS_FILE


def main():
    evaluator.evaluate_annotations(ANNOTATION_EVALUATION_INFO_FILE, ANNOTATION_EVALUATION_RESULTS_FILE)


if __name__ == "__main__":
    main()
