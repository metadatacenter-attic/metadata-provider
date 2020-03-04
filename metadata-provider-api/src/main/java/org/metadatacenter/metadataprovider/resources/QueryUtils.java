package org.metadatacenter.metadataprovider.resources;


import org.apache.commons.lang3.tuple.Pair;

import javax.ws.rs.BadRequestException;
import java.util.HashMap;
import java.util.Map;

public class QueryUtils {

  static final Map<String, String> ontologyPrefixes = new HashMap<String, String>() {
    {
      put("NCIT", "http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#");
      put("BIOLINK", "https://w3id.org/biolink/biolinkml/meta/");
      put("ACGT-MO", "http://www.ifomis.org/acgt/1.0#");
      put("ARO", "http://purl.obolibrary.org/obo/ARO_");
      put("AURA", "http://www.projecthalo.com/aura#");
      put("BTO", "http://purl.obolibrary.org/obo/BTO_");
      put("EFO", "http://www.ebi.ac.uk/efo/EFO_");
      put("CCONT", "http://www.ebi.ac.uk/efo/EFO_");
      put("CL", "http://purl.obolibrary.org/obo/CL_");
      put("CLO", "http://purl.obolibrary.org/obo/CLO_");
      put("PR", "http://purl.obolibrary.org/obo/PR_");
      put("GO", "http://purl.obolibrary.org/obo/GO_");
      put("NCBITAXON", "http://purl.obolibrary.org/obo/NCBITaxon_");
      put("CPT", "http://purl.bioontology.org/ontology/CPT/");
      put("CSEO", "http://scai.fraunhofer.de/CSEO#CSEO_");
      put("DERMLEX", "http://www.owl-ontologies.com/unnamed.owl#");
      put("GEXO", "http://identifiers.org/ncbigene/");
      put("IOBC", "http://purl.jp/bio/4/id/");
      put("LOINC", "http://purl.bioontology.org/ontology/LNC/");
      put("MCBCC", "http://sig.biostr.washington.edu/fma3.0#");
      put("MCCL", "http://purl.bioontology.org/ontology/MCCL/MCC_");
      put("MONDO", "http://purl.obolibrary.org/obo/MONDO_");
      put("NPO", "http://purl.bioontology.org/ontology/npo#NPO_");
      put("OGG", "http://purl.obolibrary.org/obo/OGG_");
      put("OHPI", "http://purl.obolibrary.org/obo/OGG_");
      put("PATHLEX", "http://www.semanticweb.org/david/ontologies/2013/0/pathLex.owl#");
      put("PATO", "http://purl.obolibrary.org/obo/PATO_");
      put("PLOSTHES", "http://localhost/plosthes.2017-1#");
      put("SEP", "http://purl.obolibrary.org/obo/sep_");
      put("SNOMEDCT", "http://purl.bioontology.org/ontology/SNOMEDCT/");
    }
  };

  /***
   * Parses the query and returns a map with attribute names and values. The query must be written using the syntax:
   * "attributeName1:attributeValue1 AND attributeName2:attributeValue2 AND ... AND attributeNameN:attributeValueN"
   * @param query
   * @return
   */
  static Map<String, String> parseQuery(String query, boolean isAnnotatedSamplesQuery) {

    final String AND_SEPARATOR = "AND";
    final String ATT_VALUE_SEPARATOR = "=";

    Map<String, String> attNamesValuesMap = new HashMap<>();
    if (query.contains(AND_SEPARATOR)) {
      String[] separated = query.split(AND_SEPARATOR);
      for (String attNameValue : separated) {
        Pair<String, String> attributeNameValuePair = parseAttributeNameValueString(attNameValue,
            ATT_VALUE_SEPARATOR, isAnnotatedSamplesQuery);
        attNamesValuesMap.put(attributeNameValuePair.getKey(), attributeNameValuePair.getValue());
      }
    } else {
      Pair<String, String> attributeNameValuePair = parseAttributeNameValueString(query, ATT_VALUE_SEPARATOR,
          isAnnotatedSamplesQuery);
      attNamesValuesMap.put(attributeNameValuePair.getKey(), attributeNameValuePair.getValue());
    }
    return attNamesValuesMap;
  }

  private static Pair<String, String> parseAttributeNameValueString(String attNameValue, String separator,
                                                                    boolean isAnnotatedSamplesQuery) {
    if (attNameValue.contains(separator)) {
      String attributeName = attNameValue.substring(0, attNameValue.indexOf(separator)).trim();
      if (isAnnotatedSamplesQuery) {
        attributeName = resolveOntologyPrefix(attributeName);
      }
      String attributeValue = attNameValue.substring(attNameValue.indexOf(separator) + 1).trim();
      if (isAnnotatedSamplesQuery) {
        attributeValue = resolveOntologyPrefix(attributeValue);
      }
      return Pair.of(attributeName, attributeValue);
    } else {
      throw new BadRequestException("Malformed attribute name and value pair: " + attNameValue);
    }
  }

  private static String resolveOntologyPrefix(String stringWithPrefix) {
    String separator = ":";
    if (stringWithPrefix.contains(separator)) {
      String prefix = (stringWithPrefix.substring(0, stringWithPrefix.indexOf(separator))).toUpperCase();
      String termId = stringWithPrefix.substring(stringWithPrefix.indexOf(separator) + 1);
      if (ontologyPrefixes.containsKey(prefix)) {
        return ontologyPrefixes.get(prefix) + termId;
      } else {
        throw new InternalError("Could not find ontology prefix: " + prefix);
      }
    } else {
      return stringWithPrefix;
    }
  }

}
