#!/usr/bin/python3

# Utilities to evaluate the annotations generated

import json
import os

import scripts.util.utils as utils


def evaluate_annotations(annotation_evaluation_info_file, annotation_evaluation_results_file):
    """
    Evaluates the annotations generated
    :param annotation_evaluation_info_file:
    :param annotation_evaluation_results_file:
    :return:
    """
    print('Input file (file with info about the correctness of annotations): ' + annotation_evaluation_info_file)
    print('Output file (evaluation results): ' + annotation_evaluation_results_file)

    run = True
    if os.path.exists(annotation_evaluation_results_file):
        if not utils.confirm('The destination file already exist. Do you want to overwrite it [y/n]? '):
            run = False
    if run:
        if not os.path.exists(os.path.dirname(annotation_evaluation_results_file)):
            os.makedirs(os.path.dirname(annotation_evaluation_results_file))

        with open(annotation_evaluation_info_file) as f:

            total_unique_att_values_count = 0
            total_att_values_count = 0
            total_unique_annotations_count = 0
            total_annotations_count = 0

            total_true_positives = 0
            unique_true_positives = 0

            annotations_info = json.load(f)
            for att_name in annotations_info['att-values']:
                for att_value in annotations_info['att-values'][att_name]:

                    total_unique_att_values_count += 1
                    total_att_values_count += annotations_info['att-values'][att_name][att_value]['count']

                    if annotations_info['att-values'][att_name][att_value]['term-uri'] is not None:
                        total_unique_annotations_count += 1
                        total_annotations_count += annotations_info['att-values'][att_name][att_value]['count']

                        if annotations_info['att-values'][att_name][att_value]['is-correct']:
                            unique_true_positives += 1
                            total_true_positives += annotations_info['att-values'][att_name][att_value]['count']

        print("\nANNOTATION RESULTS: ")
        print("- Attribute values: " + str(total_att_values_count))
        print("- Unique attribute values: " + str(total_unique_att_values_count))
        print("- Annotations generated: " + str(total_annotations_count))
        print("- Unique annotations generated: " + str(total_unique_annotations_count))

        total_non_annotated_values = total_att_values_count - total_annotations_count
        percent_non_annotated_values = (total_non_annotated_values / total_att_values_count) * 100
        print("- Values with no annotations: "
              + str(total_non_annotated_values) + " (%.2f" % percent_non_annotated_values + "%)")

        total_non_annotated_unique_values = total_unique_att_values_count - total_unique_annotations_count
        percent_non_annotated__unique_values = (total_non_annotated_unique_values / total_unique_att_values_count) * 100
        print("- Unique values with no annotations: "
              + str(total_non_annotated_unique_values) + " (%.2f" % percent_non_annotated__unique_values + "%)")

        print("- Total True Positives: " + str(total_true_positives))
        print("- Unique True Positives: " + str(unique_true_positives))
        print("- Annotation accuracy (total): %.2f" % (total_true_positives / total_att_values_count))
        print("- Annotation accuracy (unique values): %.2f" % (unique_true_positives / total_unique_att_values_count))






