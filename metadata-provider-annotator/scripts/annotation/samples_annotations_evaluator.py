#!/usr/bin/python3

# Utilities to evaluate the annotations generated

import json
import os
import copy
import datetime
import sys

import scripts.util.utils as utils


def evaluate_annotations(annotation_evaluation_info_file_reviewed, annotation_evaluation_results_file):
    """
    Evaluates the annotations generated
    :param annotation_evaluation_info_file_reviewed:
    :param annotation_evaluation_results_file:
    :return:
    """
    print(
        'Input file (file with info about the correctness of annotations): ' + annotation_evaluation_info_file_reviewed)
    print('Output file (evaluation results): ' + annotation_evaluation_results_file)

    run = True
    if os.path.exists(annotation_evaluation_results_file):
        if not utils.confirm('The destination file already exist. Do you want to overwrite it [y/n]? '):
            run = False
    if run:
        if not os.path.exists(os.path.dirname(annotation_evaluation_results_file)):
            os.makedirs(os.path.dirname(annotation_evaluation_results_file))

        with open(annotation_evaluation_info_file_reviewed) as f:

            outcomes = {
                "TP": 0,
                "TN": 0,
                "FP": 0,
                "FN": 0
            }

            results = {
                "ALL": copy.deepcopy(outcomes),
                "disease": copy.deepcopy(outcomes),
                "tissue": copy.deepcopy(outcomes),
                "cell type": copy.deepcopy(outcomes),
                "cell line": copy.deepcopy(outcomes),
                "sex": copy.deepcopy(outcomes)
            }

            annotations_info = json.load(f)
            for att_name in annotations_info['att-values']:
                for att_value in annotations_info['att-values'][att_name]:

                    count = annotations_info['att-values'][att_name][att_value]['count']
                    outcome = annotations_info['att-values'][att_name][att_value]['is-correct']

                    if outcome:
                        results[att_name][outcome] = results[att_name][outcome] + count
                        results['ALL'][outcome] = results['ALL'][outcome] + count
                        outcome = None
                    # else:
                    #     print("Error: the outcome cannot be null. The execution has been stopped.")
                    #     sys.exit(1)
                        # Error

        # Save evaluation results
        with open(annotation_evaluation_results_file, 'w') as results_file:

            print('GENERAL INFO:', file=results_file)
            print('- Current date: ' + str(datetime.datetime.now()), file=results_file)
            print('- Input file: ' + os.path.abspath(annotation_evaluation_info_file_reviewed), file=results_file)

            print("\nANNOTATION RESULTS: ", file=results_file)

            for results_item in results:
                print("\nResults for: " + results_item, file=results_file)
                for outcome in outcomes:
                    print("  " + outcome + ": " + str(results[results_item][outcome]), file=results_file)

                tp = results[results_item]["TP"]
                fp = results[results_item]["FP"]
                tn = results[results_item]["TN"]
                fn = results[results_item]["FN"]

                if tp == 0:
                    precision = 0
                    recall = 0
                    f_measure = 0
                else:
                    precision = tp / (tp + fp)
                    recall = tp / (tp + fn)
                    f_measure = (2 * precision * recall) / (precision + recall)

                print("  - Precision: " + '{:,.2f}'.format(precision), file=results_file)
                print("  - Recall: " + '{:,.2f}'.format(recall), file=results_file)
                print("  - F-Measure: " + '{:,.2f}'.format(f_measure), file=results_file)