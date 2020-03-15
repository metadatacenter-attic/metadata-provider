#!/usr/bin/python3

# Utility to perform some exploratory analysis on a csv file with attribute names and values

import scripts.constants as constants
import pandas as pd
import matplotlib.pyplot as plt


INPUT_FILE = constants.NCBI_ANALYSIS_VALUES_INPUT_FILE
GROUP_BY_ATTS = ['disease', 'tissue', 'sex', 'cell type', 'cell line']


def main():
    df = pd.read_csv(INPUT_FILE)
    print('GENERAL DESCRIPTION OF THE DATASET: ')
    print(df.describe())
    print()
    print('UNIQUE VALUES PER COLUMN: ')
    col_names = df.columns.tolist()
    index = 0
    for col in df:
        print('  Column name: ' + col_names[index])
        print('    Unique values (' + str(len(df[col].unique())) + '): ')
        for value in df[col].unique():
            print('     - ' + str(value))
        index = index + 1

    # Generate plots with frequencies of unique values
    for col in df:
        df[col].value_counts().plot(kind='bar', rot=90)
        plt.xlabel(col, labelpad=14)
        plt.ylabel("Count", labelpad=14)
        plt.show()

    # Count of different combinations
    print(df.groupby(GROUP_BY_ATTS, as_index=False).size())


if __name__ == "__main__":
    main()
