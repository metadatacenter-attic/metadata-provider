#!/usr/bin/python3

# Utility to perform search queries on BioSample based on the NCBI's ESearch utility
# Sample query: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=biosample&term=%22disease%3Dliver%20cancer%22%5Battr%5D+AND+%22sex%3Dmale%22%5Battr%5D+AND+%22tissue%3Dplasma%22%5Battr%5D+AND+%22Homo+sapiens%22%5BOrganism%5D
# Documentation: https://www.ncbi.nlm.nih.gov/books/NBK25499/#chapter4.ESearch

import scripts.constants as constants
import pandas as pd
import matplotlib.pyplot as plt


INPUT_FILE = constants.NCBI_ANALYSIS_VALUES_INPUT_FILE


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
            print('     - ' + value)
        index = index + 1

    # Generate plots with frequencies of unique values
    for col in df:
        df[col].value_counts().plot(kind='bar', rot=90)
        plt.xlabel(col, labelpad=14)
        plt.ylabel("Count", labelpad=14)
        plt.show()

    # Count of different combinations
    print(df.groupby(['disease', 'tissue', 'sex'], as_index=False).size())


if __name__ == "__main__":
    main()
