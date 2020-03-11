export const API_BASE_URL = "http://localhost:8080/";
//export const API_BASE_URL = "http://api.kp.metadatacenter.org/";

export const REGCOGNIZED_BIOSAMPLE_ATT_NAMES = ["EDTA inhibitor tested", "FAO classification", "HIV status", "NARMS isolate number", "Omics Observatory ID", "Population Description", "Super Population Code", "Super Population Description", "absolute air humidity", "affection status", "age", "agrochemical additions", "air temperature", "air temperature regimen", "alkalinity", "alkyl diethers", "altitude", "aluminium saturation", "aluminium saturation method", "aminopeptidase activity", "ammonium", "amniotic fluid color", "analyte type", "anamorph", "annual and seasonal precipitation", "annual and seasonal temperature", "antibiotic regimen", "atmospheric data", "authority", "bacterial carbon production", "bacterial production", "bacterial respiration", "barometric pressure", "beta-lactamase family", "biochemical oxygen demand", "biological material", "biomass", "biomaterial provider", "biospecimen repository", "biospecimen repository sample id", "biovar", "birth control", "birth date", "birth location", "bishomohopanol", "blood disorder", "blood pressure diastolic", "blood pressure systolic", "body habitat", "body mass index", "body product", "breed", "breeding history", "breeding method", "broad-scale environmental context", "bromide", "building occupancy type", "building setting", "calcium", "carbapenemase", "carbon dioxide", "carbon monoxide", "carbon/nitrogen ratio", "cell line", "cell subtype", "cell type", "chemical administration", "chemical mutagen", "chemical oxygen demand", "child of", "chloride", "chlorophyll", "climate environment", "clone", "clone lib", "collected by", "collection date", "component organism", "compound", "conductivity", "crop rotation", "cultivar", "culture collection", "current land use", "current vegetation", "current vegetation method", "death date", "density", "depth", "derived from", "dermatology disorder", "description", "development stage", "dew point", "diet", "diether lipids", "disease", "disease stage", "dissolved carbon dioxide", "dissolved hydrogen", "dissolved inorganic carbon", "dissolved inorganic nitrogen", "dissolved inorganic phosphorus", "dissolved organic carbon", "dissolved organic nitrogen", "dissolved oxygen", "dominant hand", "dose", "douche", "downward PAR", "drainage classification", "drug usage", "dry mass", "ecotype", "efficiency percent", "elevation", "emulsions", "encoded traits", "environmental medium", "environmental package", "estimated size", "ethnicity", "experimental factor", "extrachromosomal elements", "extreme event", "extreme salinity", "family id", "family role", "fertilizer regimen", "fetal health status", "filter type", "fire", "flooding", "fluorescence", "forma", "forma specialis", "fungicide regimen", "gap accession", "gap change status", "gap consent code", "gap consent short name", "gap sample id", "gap study version", "gap subject id", "gaseous environment", "gaseous substances", "gastrointestinal tract disorder", "genotype", "geographic location", "gestation state", "glucosidase activity", "gravidity", "gravity", "growth hormone regimen", "growth media", "growth protocol", "gynecological disorder", "haplotype", "health state", "heating and cooling system type", "heavy metals", "heavy metals method", "height or length", "herbicide regimen", "histological type", "horizon", "horizon method", "host", "host HIV status", "host age", "host blood pressure diastolic", "host blood pressure systolic", "host body habitat", "host body mass index", "host body product", "host body temperature", "host color", "host description", "host diet", "host disease", "host disease outcome", "host disease stage", "host dry mass", "host family relationship", "host genotype", "host growth conditions", "host health state", "host height", "host infra specific name", "host infra specific rank", "host last meal", "host length", "host life stage", "host occupation", "host phenotype", "host pulse", "host sex", "host shape", "host subject id", "host substrate", "host taxonomy ID", "host tissue sampled", "host total mass", "host wet mass", "hrt", "humidity", "humidity regimen", "hysterectomy", "identified by", "image file", "indoor space", "indoor surface", "industrial effluent percent", "infra specific name", "infra specific rank", "inorganic particles", "investigation type", "is tumor", "isolate", "isolate name alias", "isolation and growth condition", "isolation source", "karyotype", "kidney disorder", "lab host", "label", "last meal", "latitude and longitude", "life stage", "light intensity", "light type", "link to classification information", "link to climate information", "links to additional analysis", "liver disorder", "local classification", "local classification method", "local-scale environmental context", "magnesium", "major diet change in last six months", "maternal health status", "mating type", "mean friction velocity", "mean peak friction velocity", "mechanical damage", "medical history performed", "medication code", "menarche", "menopause", "methane", "microbial biomass", "microbial biomass method", "mineral nutrient regimen", "miscellaneous parameter", "molecular data type", "morphology", "n alkanes", "nitrate", "nitrite", "nitrogen", "non mineral nutrient regimen", "nose throat disorder", "nose/mouth/teeth/throat disorder", "number of replicons", "observed biotic relationship", "occupancy at sampling", "occupant density at sampling", "occupation", "organic carbon", "organic matter", "organic nitrogen", "organic particles", "organism count", "organism modifier note", "original subject id", "outbreak", "oxygen", "oxygenation status of sample", "pH", "pH method", "pH regimen", "particle classification", "particulate organic carbon", "particulate organic nitrogen", "passage history", "pathogenicity", "pathotype", "pathovar", "perturbation", "pesticide regimen", "petroleum hydrocarbon", "phaeopigments", "phenotype", "phosphate", "phospholipid fatty acid", "photon flux", "plant body site", "plant product", "ploidy", "pollutants", "pooling of DNA extracts", "population", "porosity", "potassium", "pregnancy", "presence of pets or farm animals", "pressure", "pretreatment", "previous land use", "previous land use method", "primary production", "primary treatment", "profile position", "project name", "propagation", "pulmonary disorder", "pulse", "race", "radiation regimen", "rainfall regimen", "reactor type", "redox potential", "reference for biomaterial", "reference material", "relationship to oxygen", "relative air humidity", "repository", "respirable particulate matter", "risk group", "salinity", "salinity method", "salt regimen", "same as", "sample collection device or method", "sample material processing", "sample name", "sample salinity", "sample size", "sample size sorting method", "sample storage duration", "sample storage location", "sample storage temperature", "sample type", "sample use", "sample volume or weight for DNA extraction", "seasonal environment", "secondary treatment", "sediment type", "serogroup", "serotype", "serovar", "sewage type", "sex", "sexual activity", "sieving", "silicate", "size fraction selected", "slope aspect", "slope gradient", "sludge retention time", "smoker", "sodium", "soil type", "soil type method", "solar irradiance", "soluble inorganic material", "soluble organic material", "soluble reactive phosphorus", "source material identifiers", "source name", "source of UViGs", "space typical state", "special diet", "specimen voucher", "standing water regimen", "storage conditions", "strain", "stud book number", "study completion status", "study design", "study disease", "study name", "sub species", "subclone", "subgroup", "subject is affected", "submitted sample id", "submitted subject id", "submitter handle", "submitter-asserted type strain", "subsource note", "subspecific genetic lineage", "substrain", "substrate", "substructure type", "subtype", "sulfate", "sulfide", "surface humidity", "surface material", "surface moisture", "surface moisture pH", "surface temperature", "surface-air contaminant", "suspended particulate matter", "suspended solids", "teleomorph", "temperature", "tertiary treatment", "texture", "texture method", "tidal stage", "tillage", "time since last toothbrushing", "time since last wash", "tissue", "tissue culture growth media", "tissue lib", "total N method", "total carbon", "total depth of water column", "total dissolved nitrogen", "total inorganic nitrogen", "total mass", "total nitrogen", "total organic carbon", "total organic carbon method", "total particulate carbon", "total phosphate", "total phosphorus", "travel outside the country in last six months", "treatment", "trophic level", "turbidity", "twin sibling existence", "type status", "typical occupant density", "urine collection method", "urogenital disorder", "urogenital tract disorder", "variety", "ventilation rate", "ventilation type", "virus enrichment approach", "volatile organic compounds", "wastewater type", "water content", "water content of soil", "water content of soil method", "water current", "water temperature regimen", "watering regimen", "weight loss in last three months", "wet mass", "wind direction", "wind speed"];

export const ONTOLOGY_NAMES = {
  "MONDO": "Mondo Disease Ontology",
  "BTO": "BRENDA Tissue Ontology",
  "UPHENO": "Unified Phenotype Ontology",
  "NCIT": "National Cancer Institute Thesaurus",
  "CL": "Cell Ontology",
  "CLO": "Cell Line Ontology",
  "EFO": "Experimental Factor Ontology",
  "PATO": "Phenotypic Quality Ontology",
  "BIOLINK": "Biolink Model"
};

export const SAMPLE_QUERIES =
  [{
    "researchQuestion": "I need to find information about biological samples in the setting of <u>myelodysplasia</u>.",
    "researchQuestionShort": "Myelodysplasia",
    "relevantAttributes": ["disease"],
    "queriesOriginalDB": [
      "disease=myelodysplasia",
      "disease=myelodysplastic syndrome",
      "disease=myelodysplastic syndrome (mds)",
      "disease=myelodysplastic syndromes",
      "disease=mds"
    ],
    "queriesAnnotatedDB": [
      "disease=myelodysplasia",
      "disease=myelodysplastic syndrome",
      "disease=myelodysplastic syndrome (mds)",
      "disease=myelodysplastic syndromes",
      "disease=mds",
      "biolink:Disease=mondo:0018881"
    ]
  },
    {
      "researchQuestion": "I need to find information about <u>male</u> biological samples in the setting of <u>myelodysplasia</u>.",
      "researchQuestionShort": "Myelodysplasia, male",
      "relevantAttributes": ["disease", "sex"],
      "queriesOriginalDB": [
        "disease=myelodysplasia AND sex=male",
        "disease=myelodysplastic syndrome AND sex=male",
        "disease=myelodysplastic syndrome (mds) AND sex=male",
        "disease=myelodysplastic syndromes AND sex=male",
        "disease=mds AND sex=male"
      ],
      "queriesAnnotatedDB": [
        "disease=myelodysplasia AND sex=male",
        "disease=myelodysplastic syndrome AND sex=male",
        "disease=myelodysplastic syndrome (mds) AND sex=male",
        "disease=myelodysplastic syndromes AND sex=male",
        "disease=mds AND sex=male",
        "biolink:Disease=mondo:0018881 AND biolink:BiologicalSex=pato:0000384"
      ]
    },
    {
      "researchQuestion": "I need to find information about <u>female</u> biological samples in the setting of <u>myelodysplasia</u>.",
      "researchQuestionShort": "Myelodysplasia, female",
      "relevantAttributes": ["disease", "sex"],
      "queriesOriginalDB": [
        "disease=myelodysplasia AND sex=female",
        "disease=myelodysplastic syndrome AND sex=female",
        "disease=myelodysplastic syndrome (mds) AND sex=female",
        "disease=myelodysplastic syndromes AND sex=female",
        "disease=mds AND sex=female"
      ],
      "queriesAnnotatedDB": [
        "disease=myelodysplasia AND sex=female",
        "disease=myelodysplastic syndrome AND sex=female",
        "disease=myelodysplastic syndrome (mds) AND sex=female",
        "disease=myelodysplastic syndromes AND sex=female",
        "disease=mds AND sex=female",
        "biolink:Disease=mondo:0018881 AND biolink:BiologicalSex=pato:0000383"
      ]
    },
    {
      "researchQuestion": "I need to find information about biological samples in the setting of <u>hepatocellular carcinoma</u>.",
      "researchQuestionShort": "Hepatocellular carcinoma",
      "relevantAttributes": ["disease"],
      "queriesOriginalDB": [
        "disease=hcc",
        "disease=hepatocellular carcinoma",
        "disease=hepatoma"
      ],
      "queriesAnnotatedDB": [
        "disease=hcc",
        "disease=hepatocellular carcinoma",
        "disease=hepatoma",
        "biolink:Disease=mondo:0007256"
      ]
    },
    {
      // Annotated: Show #1 and #4. It contains also Huh7.5.1-derived cells (e.g., #2)
      "researchQuestion": "I need to find information about <u>hepatocellular carcinoma</u> samples from the <u>HuH-7 cell line</u>.",
      "researchQuestionShort": "Hepatocellular carcinoma, HuH-7 cell line",
      "relevantAttributes": ["disease", "cell line"],
      "queriesOriginalDB": [
        "disease=hepatocellular carcinoma AND cell line=HuH-7",
        "disease=hepatocellular carcinoma AND cell line=HuH7",
        "disease=hcc AND cell line=HuH-7",
        "disease=hcc AND cell line=HuH7",
        "disease=hepatoma AND cell line=HuH-7",
        "disease=hepatoma AND cell line=HuH7"
      ],
      "queriesAnnotatedDB": [
        "disease=hepatocellular carcinoma AND cell line=HuH-7",
        "disease=hepatocellular carcinoma AND cell line=HuH7",
        "disease=hcc AND cell line=HuH-7",
        "disease=hcc AND cell line=HuH7",
        "disease=hepatoma AND cell line=HuH-7",
        "disease=hepatoma AND cell line=HuH7",
        "biolink:Disease=mondo:0007256 AND biolink:CellLine=clo:0009989"
      ]
    },
    {
      "researchQuestion": "I need to find information about <u>hepatocellular carcinoma</u> samples from the <u>HepaRG cell line</u>.",
      "researchQuestionShort": "Hepatocellular carcinoma, HepaRG cell line",
      "relevantAttributes": ["disease", "cell line"],
      "queriesOriginalDB": [
        "disease=hepatocellular carcinoma AND cell line=HepaRG",
        "disease=hcc AND cell line=HepaRG",
        "disease=hepatoma AND cell line=HepaRG"
      ],
      "queriesAnnotatedDB": [
        "disease=hepatocellular carcinoma AND cell line=HepaRG",
        "disease=hcc AND cell line=HepaRG",
        "disease=hepatoma AND cell line=HepaRG",
        "biolink:Disease=mondo:0007256 AND biolink:CellLine=efo:0001186"
      ]
    },
    {
      "researchQuestion": "I need to find information about <u>male</u> biological samples in the setting of <u>hepatocellular carcinoma</u>.",
      "researchQuestionShort": "Hepatocellular carcinoma, male",
      "relevantAttributes": ["disease", "sex"],
      "queriesOriginalDB": [
        "disease=hcc AND sex=male",
        "disease=hepatocellular carcinoma AND sex=male",
        "disease=hepatoma AND sex=male"
      ],
      "queriesAnnotatedDB": [
        "disease=hcc AND sex=male",
        "disease=hepatocellular carcinoma AND sex=male",
        "disease=hepatoma AND sex=male",
        "biolink:Disease=mondo:0007256 AND biolink:BiologicalSex=pato:0000384"
      ]
    },

    {
      "researchQuestion": "I need to find information about <u>female</u> biological samples in the setting of <u>hepatocellular carcinoma</u>.",
      "researchQuestionShort": "Hepatocellular carcinoma, female",
      "relevantAttributes": ["disease", "sex"],
      "queriesOriginalDB": [
        "disease=hcc AND sex=female",
        "disease=hepatocellular carcinoma AND sex=female",
        "disease=hepatoma AND sex=female"
      ],
      "queriesAnnotatedDB": [
        "disease=hcc AND sex=female",
        "disease=hepatocellular carcinoma AND sex=female",
        "disease=hepatoma AND sex=female",
        "biolink:Disease=mondo:0007256 AND biolink:BiologicalSex=pato:0000383"
      ]
    },
    {
      "researchQuestion": "I need to find information about biological samples in the setting of <u>systemic lupus erythematosus</u>.",
      "researchQuestionShort": "Systemic lupus erythematosus",
      "relevantAttributes": ["disease"],
      "queriesOriginalDB": [
        "disease=systemic lupus erythematosus",
        "disease=sle",
        "disease=systemic lupus erythematosus (SLE)"
      ],
      "queriesAnnotatedDB": [
        "disease=systemic lupus erythematosus",
        "disease=sle",
        "disease=systemic lupus erythematosus (SLE)",
        "biolink:Disease=mondo:0007915"
      ]
    },
    {
      "researchQuestion": "I need to find information about <u>male</u> biological samples in the setting of <u>systemic lupus erythematosus</u>.",
      "researchQuestionShort": "Systemic lupus erythematosus, male",
      "relevantAttributes": ["disease", "sex"],
      "queriesOriginalDB": [
        "disease=systemic lupus erythematosus AND sex=male",
        "disease=sle AND sex=male",
        "disease=systemic lupus erythematosus (SLE) AND sex=male"
      ],
      "queriesAnnotatedDB": [
        "disease=systemic lupus erythematosus AND sex=male",
        "disease=sle AND sex=male",
        "disease=systemic lupus erythematosus (SLE) AND sex=male",
        "biolink:Disease=mondo:0007915 AND biolink:BiologicalSex=pato:0000384"
      ]
    },
    {
      "researchQuestion": "I need to find information about <u>female</u> biological samples in the setting of <u>systemic lupus erythematosus</u>.",
      "researchQuestionShort": "Systemic lupus erythematosus, female",
      "relevantAttributes": ["disease", "sex"],
      "queriesOriginalDB": [
        "disease=systemic lupus erythematosus AND sex=female",
        "disease=sle AND sex=female",
        "disease=systemic lupus erythematosus (SLE) AND sex=female"
      ],
      "queriesAnnotatedDB": [
        "disease=systemic lupus erythematosus AND sex=female",
        "disease=sle AND sex=female",
        "disease=systemic lupus erythematosus (SLE) AND sex=female",
        "biolink:Disease=mondo:0007915 AND biolink:BiologicalSex=pato:0000383"
      ]
    },
    {
      "researchQuestion": "I need to find information about biological samples from <u>epithelial cells</u>",
      "researchQuestionShort": "Epithelial cells",
      "relevantAttributes": ["cell type"],
      "queriesOriginalDB": [
        "cell type=epithelial",
        "cell type=epithelial cell",
        "cell type=epithelial cells",
      ],
      "queriesAnnotatedDB": [
        "cell type=epithelial",
        "cell type=epithelial cell",
        "cell type=epithelial cells",
        "biolink:CellType=cl:0000066"
      ]
    },
    {
      // The goal is not to show different queries, but how the results are aggregated
      "researchQuestion": "What are the most common <u>diseases</u> studied using <u>liver tissue</u>?",
      "researchQuestionShort": "Liver tissue",
      "relevantAttributes": ["tissue"],
      "queriesOriginalDB": [
        "tissue=liver"
      ],
      "queriesAnnotatedDB": [
        "tissue=liver",
        "bto:0000759=bto:0000759"
      ]
    }
  ];