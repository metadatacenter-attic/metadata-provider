#!/usr/bin/python3

# Utilities to annotate free text using ontology terms

import pandas as pd
import os
import scripts.util.utils as utils

def annotate_col_names(df):
    COL_NAME_ANNOTATION_SUFFIX = '_annotation'
    """
    Annotates the column names of a data frame and returns the data frame with additional columns that contain the
    annotations
    :param df:
    :return:
    """
    for col_name in df:
        term = "https://annotation1"
        df[col_name + COL_NAME_ANNOTATION_SUFFIX] = term

    return df


def annotate_csv(input_file, output_file):
    """
    Annotates a CSV file using ontology terms. This function assumes that the first row contains column names that
    represent attributes or variables in the real world, and that the rest of the rows contain values for them
    :param input_file:
    :param output_file:
    :return:
    """
    print('Input file: ' + input_file)
    print('Output file: ' + output_file)

    run = True
    if os.path.exists(output_file):
        if not utils.confirm('The destination file already exist. Do you want to overwrite it [y/n]? '):
            run = False
    if run:
        if not os.path.exists(os.path.dirname(output_file)):
            os.makedirs(os.path.dirname(output_file))

        # Read input csv
        df = pd.read_csv(input_file)

        df_annotated_col_names = annotate_col_names(df)

        # Export output to CSV
        df_annotated_col_names.to_csv(output_file, index=None, header=True)




