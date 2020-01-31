#!/usr/bin/python3

# Utility to perform search queries on BioSample based on the NCBI's ESearch utility
# Sample query: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=biosample&term=%22disease%3Dliver%20cancer%22%5Battr%5D+AND+%22sex%3Dmale%22%5Battr%5D+AND+%22tissue%3Dplasma%22%5Battr%5D+AND+%22Homo+sapiens%22%5BOrganism%5D
# Documentation: https://www.ncbi.nlm.nih.gov/books/NBK25499/#chapter4.ESearch

import requests
import urllib.parse as prs

API_ENDPOINT = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=biosample"


def biosample_search(query):
    """
    Perform biosample search
    :param query: search query in BioSample format (e.g., "disease=liver cancer"[attr] AND "Homo sapiens"[Organism])
    :return:
    """

    url = API_ENDPOINT + '&term=' + prs.quote(query)
    response = requests.get(url)
    return response.text
