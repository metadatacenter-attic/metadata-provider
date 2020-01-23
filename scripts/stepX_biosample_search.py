#!/usr/bin/python3

# Utility to ...

import scripts.ncbi.biosample_search as bss

QUERY_1 = '"disease=hepatocellular carcinoma"[attr] AND "tissue=blood"[attr] AND "sex=female"[attr] AND "Homo sapiens"[Organism]'


def main():
    query = QUERY_1
    response = bss.biosample_search(query)
    print(response)


if __name__ == "__main__":
    main()
