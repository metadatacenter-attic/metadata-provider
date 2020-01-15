import time
import sys


def get_base_folder(expected_exec_folder):
    """
    Returns the right execution folder
    :param expected_exec_folder:
    :return:
    """
    import os
    current_exec_folder = os.path.split(os.getcwd())[1]
    if current_exec_folder == expected_exec_folder:
        return '.'
    elif current_exec_folder != expected_exec_folder and current_exec_folder == 'scripts':
        return './..'
    else:
        print("Error: Cannot figure out the right execution folder\n")
        sys.exit(1)


def log_progress(count, block_size, total_size):
    global start_time
    if count == 0:
        start_time = time.time()
        return
    duration = time.time() - start_time
    progress_size = int(count * block_size)
    speed = int(progress_size / (1024 * duration))
    percent = int(count * block_size * 100 / total_size)
    # slow down the rate at which the messages are printed
    if count % 1000 == 0 or percent == 100:
        sys.stdout.write("...%d%%, %d MB, %d KB/s, %d seconds passed\r" %
                         (percent, progress_size / (1024 * 1024), speed, duration))
    sys.stdout.flush()


def confirm(question):
    # raw_input returns the empty string for "enter"
    yes = {'yes', 'y'}
    no = {'no', 'n'}
    sys.stdout.write(question)
    choice = input().lower()
    if choice in yes:
        return True
    elif choice in no:
        return False
    else:
        sys.stdout.write("Please respond 'y' or 'n'")


def save_dict_to_csv(dct, output_file_path):
    """
    Saves a dictionary to a CSV file
    :param dct: input dictionary
    :param output_file_path:
    :return:
    """
    import csv
    import os

    if not os.path.exists(os.path.dirname(output_file_path)):
        os.makedirs(os.path.dirname(output_file_path))
    f = csv.writer(open(output_file_path, "w"))
    for key, val in dct.items():
        f.writerow([key, val])


def sort_dict_by_values(dct):
    """
    Sorts a dictionary by its values
    :param dct:
    :return: a dictionary ordered by key values
    """
    import collections
    sorted_dct = {k: v for k, v in sorted(dct.items(), key=lambda item: item[1], reverse=True)}
    return collections.OrderedDict(sorted_dct)