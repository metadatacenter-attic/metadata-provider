package org.metadatacenter.resources;


import org.apache.commons.lang3.tuple.Pair;

import javax.ws.rs.BadRequestException;
import java.util.HashMap;
import java.util.Map;

public class QueryUtils {

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
        Pair<String, String> attributeNameValuePair = parseAttributeNameValueString(attNameValue, ATT_VALUE_SEPARATOR, isAnnotatedSamplesQuery);
        attNamesValuesMap.put(attributeNameValuePair.getKey(), attributeNameValuePair.getValue());
      }
    } else {
      Pair<String, String> attributeNameValuePair = parseAttributeNameValueString(query, ATT_VALUE_SEPARATOR, isAnnotatedSamplesQuery);
      attNamesValuesMap.put(attributeNameValuePair.getKey(), attributeNameValuePair.getValue());
    }
    return attNamesValuesMap;
  }

  private static Pair<String, String> parseAttributeNameValueString(String attNameValue, String separator, boolean isAnnotatedSamplesQuery) {
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
    if (stringWithPrefix.startsWith("NCIT:")) {
      return stringWithPrefix.replace("NCIT:", "http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#");
    }
    return stringWithPrefix;
  }


}