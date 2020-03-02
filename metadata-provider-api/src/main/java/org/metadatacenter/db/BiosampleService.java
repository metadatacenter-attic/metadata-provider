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
      // Extract unique values for project IDs and attributes
      List<UniqueBioproject> bioprojects = new ArrayList<>();
      List<UniqueBiosampleAttributeValue> diseaseValues = new ArrayList<>();
      List<UniqueBiosampleAttributeValue> tissueValues = new ArrayList<>();
      List<UniqueBiosampleAttributeValue> cellTypeValues = new ArrayList<>();
      List<UniqueBiosampleAttributeValue> cellLineValues = new ArrayList<>();
      List<UniqueBiosampleAttributeValue> sexValues = new ArrayList<>();

      // Extract unique values for project IDs and attributes
      for (Biosample sample : biosamples) {

        if (sample.getBioprojectAccession() != null) {

          int index = indexOfBioproject(sample.getBioprojectAccession(), bioprojects);

          if (index != -1) { // Update count
            UniqueBioproject found = bioprojects.get(index);
            found.setCount(found.getCount() + 1);
            bioprojects.set(index, found);
          } else { // Add new bioproject
            bioprojects.add(new UniqueBioproject(sample.getBioprojectAccession(), 1));
          }
        }

        BiosampleAttribute diseaseAttribute = sample.extractAttribute(DISEASE_ATTRIBUTE_NAME);
        addToListOfUniqueValues(diseaseValues, diseaseAttribute, isAnnotatedSamplesCollection);

        BiosampleAttribute tissueAttribute = sample.extractAttribute(TISSUE_ATTRIBUTE_NAME);
        addToListOfUniqueValues(tissueValues, tissueAttribute, isAnnotatedSamplesCollection);

        BiosampleAttribute cellTypeAttribute = sample.extractAttribute(CELL_TYPE_ATTRIBUTE_NAME);
        addToListOfUniqueValues(cellTypeValues, cellTypeAttribute, isAnnotatedSamplesCollection);

        BiosampleAttribute cellLineAttribute = sample.extractAttribute(CELL_LINE_ATTRIBUTE_NAME);
        addToListOfUniqueValues(cellLineValues, cellLineAttribute, isAnnotatedSamplesCollection);

        BiosampleAttribute sexAttribute = sample.extractAttribute(SEX_ATTRIBUTE_NAME);
        addToListOfUniqueValues(sexValues, sexAttribute, isAnnotatedSamplesCollection);
      }

      // sort by count
      Collections.sort(bioprojects, Collections.reverseOrder());
      Collections.sort(diseaseValues, Collections.reverseOrder());
      Collections.sort(tissueValues, Collections.reverseOrder());
      Collections.sort(cellTypeValues, Collections.reverseOrder());
      Collections.sort(cellLineValues, Collections.reverseOrder());
      Collections.sort(sexValues, Collections.reverseOrder());

      return new BiosampleSearchResult(biosamples, bioprojects, diseaseValues, tissueValues, cellTypeValues,
          cellLineValues, sexValues);
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

  private int indexOfBioproject(String bioprojectAccession, List<UniqueBioproject> bioprojects) {
    int index = 0;
    for (UniqueBioproject bioproject : bioprojects) {
      if (bioproject.getBioprojectAccession().equals(bioprojectAccession)) {
        return index;
      }
      index++;
    }
    return -1; // not found
  }

  private boolean isValidValue(BiosampleAttribute attribute, boolean isAnnotated) {
    if (isAnnotated) {
      return (attribute.getAttributeValueTermUri() != null ? true: false);
    }
    else {
      return (attribute.getAttributeValue() != null ? true: false);
    }
  }

  private List<UniqueBiosampleAttributeValue> addToListOfUniqueValues(
      List<UniqueBiosampleAttributeValue> listOfUniqueValuesForAttribute,
      BiosampleAttribute attribute, boolean isAnnotatedSamplesCollection) {

    if (attribute != null && isValidValue(attribute, isAnnotatedSamplesCollection)) {

      int index = indexOfAttributeValue(attribute, listOfUniqueValuesForAttribute, isAnnotatedSamplesCollection);

      if (index != -1) { // Update count in existing value
        UniqueBiosampleAttributeValue foundValue = listOfUniqueValuesForAttribute.get(index);
        foundValue.setCount(foundValue.getCount() + 1);
        listOfUniqueValuesForAttribute.set(index, foundValue);
      } else { // Add new value

        UniqueBiosampleAttributeValue result;
        if (!isAnnotatedSamplesCollection) {
          result = new UniqueBiosampleAttributeValue(attribute.getAttributeValue(), 1);
        } else {
          result = new UniqueBiosampleAttributeValue(attribute.getAttributeValueTermUri(),
              attribute.getAttributeValueTermLabel(), attribute.getAttributeValueTermSource(), 1);
        }
        listOfUniqueValuesForAttribute.add(result);

      }
    }
    return listOfUniqueValuesForAttribute;
  }

}