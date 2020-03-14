# NCATS Metadata Provider

## Introduction

Stanford's Center for Biomedical Informatics Research (BMIR) developed this prototype Metadata Provider for the NCATS Translator.
Many data sources can inform the Translator, but their power is limited by weak metadata. 
Our process strengthens weak metadata by replacing textual attribute names and values with precise ontological representations.

The most obvious beneficiary is a non-sophisticated user making a query to the Translator. 
We represent the user’s plaintext query in our UI using simple attribute names and values. 
(In the future this conversion will be offered by the Translator and may normalize the attribute name-value pairs, 
thereby clarifying the user’s intent and preparing the query for submission to the rest of the system.)

The standardized user query will be distributed to various Knowledge Providers by the Translator infrastructure.
Our own Knowledge Provider, the Metadata Provider, offers knowledge from NCBI BioSample about biomedical research samples. 
(Of course, our approach can be applied to the data descriptions from many other data sources.) 
We pre-curated the NCBI BioSample metadata—a subset of the entire BioSample repository [1]—by performing three steps:
* eliminating spelling and other syntactic weaknesses; 
* intelligently replacing text phrases with ontology terms, thereby standardizing on common terms [2]; and 
* finding unique identifiers that are already understood in a larger semantic context. 

We then tagged the original source metadata descriptions with the precise semantic identifiers we found, 
and for rapid discovery we indexed the original descriptions with the various search strings that correspond to the found identifiers.

As a result, our non-sophisticated user’s query about biomedical samples finds many more results than would otherwise be possible.
This directly and indirectly enables many more discoveries, especially for multi-part queries . 

In the future, we hope to leverage known semantic relationships to further increase results, 
and apply the knowledge we gain about metadata relationships to help convert user text queries into Translator-ready queries.

## Prototype Milestones
The initial prototype project had 5 milestones (rephrased below):
* Milestone 1: Develop software to annotate metadata attribute names with ontology terms
* Milestone 2: Develop software to annotate metadata attribute values with ontology terms
* Milestone 3: Apply our prototype software to a subset of NCBI BioSample metadata records
* Milestone 4: Make processed BioSample metadata available to Translator through BioThings Explorer
* Milestone 5: Demonstrate enhanced query capabilities made possible by our work

## Architecture Diagram

The following diagram shows the overview of the Metadata Provider Architecture, 
including the components responsible for each milestone from the section above.

<p align="center"><img src="https://github.com/metadatacenter/metadata-provider/blob/master/img/MetadataProviderArchitecture.png" width="90%" align="center" />
</p>

## Repository Content 

The three repository folders contain all the code required for the demonstration. Numbers in brackets refer to the Milestones (above) that are addressed by the code in that folder.
* metadata-provider-annotator [1,2,3]: processes the raw metadata (attribute names and values) to find best mappings to known concepts, and tag the raw metadata with those mappings
* metadata-provider-api [4]: provides an API service to the Translator to search for BioSamples and find them by their accession number 
* metadata-provider-app [5]: user interface software for accessing and demonstrating the capabilities offered by the Metadata Provider prototype

## Public Links to Related Material

* User Interface: http://kp.metadatacenter.org
* API: http://api.kp.metadatacenter.org
* SmartAPI: http://smart-api.info/ui/4692da88e681a6b23e1ea9ed2152bd85
* Jupyter Notebook describing Annotation Pipeline: https://github.com/metadatacenter/metadata-provider/blob/master/metadata-provider-annotator/translator-demo.ipynb
* Jupyter Notebook demonstrating integration with BioThings Explorer: https://github.com/biothings/biothings_explorer/blob/master/jupyter%20notebooks/Demo%20of%20Integrating%20Stanford%20BioSample%20API%20into%20BTE.ipynb
* GitHub repo: https://github.com/metadatacenter/metadata-provider

## Footnotes

[1] The data we used from BioSample included 4,346 samples, 
representing samples of human tissue filtered to include 3 diseases 
(hepatocellular carcinoma, myelodysplasia, and systemic lupus erythematosus). 
We normalized 5 attributes associated with these samples (disease, tissue, cell type, cell line, and sex). 
We also captured the BioProject associated with the sample, to answer questions related to BioProject.

[2] Our term curation relies on BioPortal UMLS and OBO ontologies, 
following priorities of the BioThings Explorer. (The prioritization is configurable.)
