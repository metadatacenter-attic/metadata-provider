package org.metadatacenter.db;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import org.bson.BsonDocument;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.metadatacenter.api.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.regex.Pattern;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Sorts.ascending;
import static com.mongodb.client.model.Sorts.orderBy;

public class BiosampleService {

  private static final Logger logger = LoggerFactory.getLogger(BiosampleService.class);

  private final MongoCollection<Document> samplesCollection;
  private final boolean isAnnotatedSamplesCollection;
  private final ObjectMapper mapper = new ObjectMapper();

  private final String SAMPLE_ID_FIELD = "biosampleAccession";
  final String ATTRIBUTE_NAME_FIELD = "attributeName";
  final String ATTRIBUTE_NAME_TERM_URI_FIELD = "attributeNameTermUri";
  final String ATTRIBUTE_NAME_TERM_LABEL_FIELD = "attributeNameTermLabel";
  final String ATTRIBUTE_NAME_TERM_ALT_LABELS_FIELD = "attributeNameTermAltLabels";
  final String ATTRIBUTE_VALUE_FIELD = "attributeValue";
  final String ATTRIBUTE_VALUE_TERM_URI_FIELD = "attributeValueTermUri";
  final String ATTRIBUTE_VALUE_TERM_LABEL_FIELD = "attributeValueTermLabel";
  final String ATTRIBUTE_VALUE_TERM_ALT_LABELS_FIELD = "attributeValueTermAltLabels";

  public BiosampleService(MongoCollection<Document> samplesCollection, boolean isAnnotatedSamplesCollection) {
    this.samplesCollection = samplesCollection;
    this.isAnnotatedSamplesCollection = isAnnotatedSamplesCollection;
  }


  public List<Biosample> getAll() throws JsonProcessingException {

    final MongoCursor<Document> iterator = samplesCollection.find().iterator();
    final List<Biosample> samples = new ArrayList<>();
    try {
      while (iterator.hasNext()) {
        final Document sampleDoc = iterator.next();
        samples.add(mapper.readValue(sampleDoc.toJson(), Biosample.class));
      }
    } finally {
      iterator.close();
    }
    return samples;
  }

  /* Deprecated */
  public List<Biosample> searchDeprecated(Map<String, String> attributesAndValuesFilter) throws JsonProcessingException {
    if (this.isAnnotatedSamplesCollection) {
      return searchAnnotatedSamples(attributesAndValuesFilter);
    } else {
      return searchOriginalSamples(attributesAndValuesFilter);
    }
  }

  public BiosampleSearchResult search(Map<String, String> attributesAndValuesFilter, boolean includeDetails) throws JsonProcessingException {

    final String DISEASE_ATTRIBUTE_NAME = "disease";
    final String TISSUE_ATTRIBUTE_NAME = "tissue";
    final String CELL_TYPE_ATTRIBUTE_NAME = "cell type";
    final String CELL_LINE_ATTRIBUTE_NAME = "cell line";
    final String SEX_ATTRIBUTE_NAME = "sex";

    List<Biosample> biosamples = null;
    if (this.isAnnotatedSamplesCollection) {
      biosamples = searchAnnotatedSamples(attributesAndValuesFilter);
    } else {
      biosamples = searchOriginalSamples(attributesAndValuesFilter);
    }

    if (!includeDetails) {

      return new BiosampleSearchResult(biosamples);

    } else {

      // Extract unique biosample accessions and unique values for project IDs and attributes
      List<String> biosampleAccessions = new ArrayList<>();
      Map<String, UniqueBioproject> bioprojectsMap = new HashMap<>();
      Map<String, UniqueBiosampleAttributeValue> diseaseValues = new HashMap<>();
      Map<String, UniqueBiosampleAttributeValue> tissueValues = new HashMap<>();
      Map<String, UniqueBiosampleAttributeValue> cellTypeValues = new HashMap<>();
      Map<String, UniqueBiosampleAttributeValue> cellLineValues = new HashMap<>();
      Map<String, UniqueBiosampleAttributeValue> sexValues = new HashMap<>();

      // Extract unique values for project IDs and attributes
      for (Biosample sample : biosamples) {

        // Biosample Accessions
        if (sample.getBiosampleAccession() != null) {
          if (!biosampleAccessions.contains(sample.getBiosampleAccession())) {
            biosampleAccessions.add(sample.getBiosampleAccession());
          }
        }

        // Bioproject Accessions
        if (sample.getBioprojectAccession() != null) {
          if (bioprojectsMap.containsKey(sample.getBioprojectAccession())) { // Update count
            UniqueBioproject found = bioprojectsMap.get(sample.getBioprojectAccession());
            found.setCount(found.getCount() + 1);
            bioprojectsMap.replace(sample.getBioprojectAccession(), found);
          } else { // Add new bioproject
            bioprojectsMap.put(sample.getBioprojectAccession(),
                new UniqueBioproject(sample.getBioprojectAccession(), 1));
          }
        }

        BiosampleAttribute diseaseAttribute = sample.extractAttribute(DISEASE_ATTRIBUTE_NAME);
        addToUniqueAttributeValuesMap(diseaseValues, diseaseAttribute, isAnnotatedSamplesCollection);

        BiosampleAttribute tissueAttribute = sample.extractAttribute(TISSUE_ATTRIBUTE_NAME);
        addToUniqueAttributeValuesMap(tissueValues, tissueAttribute, isAnnotatedSamplesCollection);

        BiosampleAttribute cellTypeAttribute = sample.extractAttribute(CELL_TYPE_ATTRIBUTE_NAME);
        addToUniqueAttributeValuesMap(cellTypeValues, cellTypeAttribute, isAnnotatedSamplesCollection);

        BiosampleAttribute cellLineAttribute = sample.extractAttribute(CELL_LINE_ATTRIBUTE_NAME);
        addToUniqueAttributeValuesMap(cellLineValues, cellLineAttribute, isAnnotatedSamplesCollection);

        BiosampleAttribute sexAttribute = sample.extractAttribute(SEX_ATTRIBUTE_NAME);
        addToUniqueAttributeValuesMap(sexValues, sexAttribute, isAnnotatedSamplesCollection);
      }

      return new BiosampleSearchResult(biosamples, biosampleAccessions, bioprojectsMap, diseaseValues, tissueValues,
          cellTypeValues, cellLineValues, sexValues);
    }
  }

  private List<Biosample> searchOriginalSamples(Map<String, String> attributesAndValuesFilter) throws JsonProcessingException {
    final List<Biosample> samples = new ArrayList<>();

    List<Bson> attNameValueFilters = new ArrayList<>();

    for (String attributeName : attributesAndValuesFilter.keySet()) {
      String attributeValue = attributesAndValuesFilter.get(attributeName);
      String attributeValueForRegex = "^" + escapeSpecialRegexChars(attributeValue) + "$";
      attNameValueFilters.add(
          elemMatch("attributes",
              and(eq(ATTRIBUTE_NAME_FIELD, attributeName),
                  regex(ATTRIBUTE_VALUE_FIELD, attributeValueForRegex, "i"))));
    }
    Bson searchFilter = and(attNameValueFilters);
    BsonDocument bsonDocument = searchFilter.toBsonDocument(BsonDocument.class,
        MongoClientSettings.getDefaultCodecRegistry());
    logger.info("Search filter: " + bsonDocument.toJson());
    MongoCursor<Document> iterator =
        samplesCollection.find(searchFilter).sort(orderBy(ascending(SAMPLE_ID_FIELD))).iterator();

    try {
      while (iterator.hasNext()) {
        final Document sampleDoc = iterator.next();
        samples.add(mapper.readValue(sampleDoc.toJson(), Biosample.class));
      }
    } finally {
      iterator.close();
    }
    return samples;
  }

  private List<Biosample> searchAnnotatedSamples(Map<String, String> attributesAndValuesFilter) throws JsonProcessingException {
    final List<Biosample> samples = new ArrayList<>();

    List<Bson> attNameValueFilters = new ArrayList<>();

    for (String attributeName : attributesAndValuesFilter.keySet()) {
      String attributeValue = attributesAndValuesFilter.get(attributeName);
      String attributeNameForRegex = "^" + escapeSpecialRegexChars(attributeName) + "$";
      String attributeValueForRegex = "^" + escapeSpecialRegexChars(attributeValue) + "$";
      attNameValueFilters.add(
          elemMatch("attributes",
              and(
                  or(
                      eq(ATTRIBUTE_NAME_TERM_URI_FIELD, attributeName),
                      regex(ATTRIBUTE_NAME_TERM_LABEL_FIELD, attributeNameForRegex, "i"),
                      in(ATTRIBUTE_NAME_TERM_ALT_LABELS_FIELD, attributeName.toLowerCase())),
                  or(
                      eq(ATTRIBUTE_VALUE_TERM_URI_FIELD, attributeValue),
                      regex(ATTRIBUTE_VALUE_TERM_LABEL_FIELD, attributeValueForRegex, "i"),
                      in(ATTRIBUTE_VALUE_TERM_ALT_LABELS_FIELD, attributeValue.toLowerCase())))));
    }
    Bson searchFilter = and(attNameValueFilters);
    BsonDocument bsonDocument = searchFilter.toBsonDocument(BsonDocument.class,
        MongoClientSettings.getDefaultCodecRegistry());
    logger.info("Search filter: " + bsonDocument.toJson());
    MongoCursor<Document> iterator =
        samplesCollection.find(searchFilter).sort(orderBy(ascending(SAMPLE_ID_FIELD))).iterator();

    try {
      while (iterator.hasNext()) {
        final Document sampleDoc = iterator.next();
        samples.add(mapper.readValue(sampleDoc.toJson(), Biosample.class));
      }
    } finally {
      iterator.close();
    }
    return samples;
  }

  private String escapeSpecialRegexChars(String str) {
    Pattern SPECIAL_REGEX_CHARS = Pattern.compile("[{}()\\[\\].+*?^$\\\\|]");
    return SPECIAL_REGEX_CHARS.matcher(str).replaceAll("\\\\$0");
  }

  /**
   * Returns the index of the value in the list, or -1 if not found
   *
   * @param attribute
   * @param attributeValuesList
   * @param searchAnnotated
   * @return
   */
  private int indexOfAttributeValue(BiosampleAttribute attribute,
                                    List<UniqueBiosampleAttributeValue> attributeValuesList,
                                    boolean searchAnnotated) {
    int index = 0;
    for (UniqueBiosampleAttributeValue attributeValueObject : attributeValuesList) {
      if (!searchAnnotated) {
        if (attribute.getAttributeValue().toLowerCase().equals(attributeValueObject.getAttributeValue().toLowerCase())) {
          return index;
        }
      } else {
        if (attribute.getAttributeValueTermUri() != null && attributeValueObject.getAttributeValueTermUri() != null) {
          if (attribute.getAttributeValueTermUri().toLowerCase().equals(attributeValueObject.getAttributeValueTermUri().toLowerCase())) {
            return index;
          }
        }
      }
      index++;
    }
    return -1; // not found
  }

  private boolean isValidValue(BiosampleAttribute attribute, boolean isAnnotated) {
    if (isAnnotated) {
      return (attribute.getAttributeValueTermUri() != null ? true : false);
    } else {
      return (attribute.getAttributeValue() != null ? true : false);
    }
  }

  private Map<String, UniqueBiosampleAttributeValue> addToUniqueAttributeValuesMap(
      Map<String, UniqueBiosampleAttributeValue> uniqueAttributeValuesMap,
      BiosampleAttribute attribute, boolean annotated) {

    if (attribute != null && isValidValue(attribute, annotated)) {

      String key;
      if (!annotated) {
        key = attribute.getAttributeValue().toLowerCase();
      } else {
        key = attribute.getAttributeValueTermUri();
      }

      if (uniqueAttributeValuesMap.containsKey(key)) { // update count
        UniqueBiosampleAttributeValue foundValue = uniqueAttributeValuesMap.get(key);
        foundValue.setCount(foundValue.getCount() + 1);
        uniqueAttributeValuesMap.put(key, foundValue);
      } else { // add new value
        UniqueBiosampleAttributeValue uniqueValue;
        if (!annotated) {
          uniqueValue = new UniqueBiosampleAttributeValue(attribute.getAttributeValue(), 1);
        } else {
          uniqueValue = new UniqueBiosampleAttributeValue(attribute.getAttributeValueTermUri(),
              attribute.getAttributeValueTermLabel(), attribute.getAttributeValueTermSource(), 1);
        }
        uniqueAttributeValuesMap.put(key, uniqueValue);
      }
    }
    return uniqueAttributeValuesMap;
  }

}