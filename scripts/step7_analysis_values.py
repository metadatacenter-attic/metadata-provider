#!/usr/bin/python3

# Utility to perform some exploratory analysis on a csv file with attribute names and values

import scripts.constants as constants
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns


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

        # Generate plots with frequencies of unique values
        df[col].value_counts().plot(kind='bar', rot=0)
        sns.set(font_scale=1.4)
        plt.xlabel(col, labelpad=14)
        plt.ylabel("Count", labelpad=14)
        plt.xticks(rotation=90)
        plt.show()

        index = index + 1





if __name__ == "__main__":
    main()
