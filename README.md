# NCATS Metadata Provider

## Introduction

Stanford's Center for Biomedical Informatics Research (BMIR) developed this prototype Metadata Provider for the NCATS Translator.
Many data sources could inform the Translator, but their power is limited by poor metadata. 
Our process strengthens weak metadata by replacing textual attribute names and values with precise ontological representations.

The most obvious beneficiary is a non-sophisticated user making a query to the Translator. 
Following this use case, we represent the user’s plaintext query in our UI as a simple attribute name and value. 
(In the future this reframing will be standardized in the Translator and may normalize the attribute name-value pairs, 
which clarify the user’s intent and prepare the query for submission to the Translator.)

Any standardized user query will then be distributed to various knowledge providers by the Translator infrastructure.
Our own Knowledge Provider, the Metadata Provider, offers knowledge from NCBI BioSample about biomedical research samples. 
(Of course, our approach can be applied to the data descriptions from many other data sources.) 
We pre-curated these data sources’ metadata by performing three steps:
* eliminating spelling and other syntactic weaknesses; 
* intelligently replacing text phrases with ontology terms, thereby standardizing on common terms [1]; and 
* assigning unique identifiers that are already understood in a larger semantic context. 

We then tag the original source metadata descriptions with our precise semantic identifiers, 
and for rapid discovery index the descriptions with the various search strings that correspond to those identifiers.

As a result, our non-sophisticated user’s query about biomedical samples will discover many more results than would otherwise be possible.
This directly and indirectly enables many more discoveries, especially for multi-part queries. 

In the future, we hope to leverage known semantic relationships to further increase returns, 
and apply the knowledge we gain about metadata relationships to help convert user text queries into Translator-ready queries.

## Prototype Milestones
The initial prototype project had 5 milestones (rephrased below):
* Milestone 1: Develop software to annotate metadata attribute names with ontology terms
* Milestone 2: Develop software to annotate metadata attribute values with ontology terms
* Milestone 3: Apply our prototype software to a subset of NCBI BioSample metadata records
* Milestone 4: Make processed BioSample metadata available to Translator through BioThings Explorer
* Milestone 5: Demonstrate enhanced query capabilities made possible by our work

## Architecture Diagram.

The following diagram shows the overview of the Metadata Provider Architecture, 
with the parts responsible for each milestone from the section above.

![Metadata Provider Architecture](https://github.com/metadatacenter/metadata-provider/blob/master/img/MetadataProviderArchitecture.png)

## Repository Content. 

Description of the content of the three folders.

## Public Links to Related Material

* User Interface: http://kp.metadatacenter.org
* API: http://api.kp.metadatacenter.org
* SmartAPI: http://smart-api.info/ui/4692da88e681a6b23e1ea9ed2152bd85
* Jupyter Notebook describing Annotation Pipeline: https://github.com/metadatacenter/metadata-provider/blob/master/metadata-provider-annotator/translator-demo.ipynb
* Jupyter Notebook demonstrating integration with BioThings Explorer: 
* GitHub repo: https://github.com/metadatacenter/metadata-provider

