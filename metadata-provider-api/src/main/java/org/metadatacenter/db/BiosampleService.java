package org.metadatacenter.db;

import com.fasterxml.jackson.annotation.JsonProperty;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
      List<Bioproject> bioprojects = new ArrayList<>();
      List<BiosampleAttributeValue> diseaseValues = new ArrayList<>();
      List<BiosampleAttributeValue> tissueValues = new ArrayList<>();
      List<BiosampleAttributeValue> cellTypeValues = new ArrayList<>();
      List<BiosampleAttributeValue> cellLineValues = new ArrayList<>();
      List<BiosampleAttributeValue> sexValues = new ArrayList<>();

      // Extract unique values for project IDs and attributes
      for (Biosample sample : biosamples) {

        if (sample.getBioprojectAccession() != null && !containsBioproject(sample.getBioprojectAccession(),
            bioprojects)) {
          bioprojects.add(new Bioproject(sample.getBioprojectAccession()));
        }

        BiosampleAttribute diseaseAttribute = sample.extractAttribute(DISEASE_ATTRIBUTE_NAME);
        if (diseaseAttribute != null && !containsAttributeValue(diseaseAttribute, diseaseValues,
            isAnnotatedSamplesCollection)) {
          if (diseaseAttribute.getAttributeValueObject(isAnnotatedSamplesCollection).isValid()) {
            diseaseValues.add(diseaseAttribute.getAttributeValueObject(isAnnotatedSamplesCollection));
          }
        }

        BiosampleAttribute tissueAttribute = sample.extractAttribute(TISSUE_ATTRIBUTE_NAME);
        if (tissueAttribute != null && !containsAttributeValue(tissueAttribute, tissueValues,
            isAnnotatedSamplesCollection)) {
          if (tissueAttribute.getAttributeValueObject(isAnnotatedSamplesCollection).isValid()) {
            tissueValues.add(tissueAttribute.getAttributeValueObject(isAnnotatedSamplesCollection));
          }
        }

        BiosampleAttribute cellTypeAttribute = sample.extractAttribute(CELL_TYPE_ATTRIBUTE_NAME);
        if (cellTypeAttribute != null && !containsAttributeValue(cellTypeAttribute, cellTypeValues,
            isAnnotatedSamplesCollection)) {
          if (cellTypeAttribute.getAttributeValueObject(isAnnotatedSamplesCollection).isValid()) {
            cellTypeValues.add(cellTypeAttribute.getAttributeValueObject(isAnnotatedSamplesCollection));
          }
        }

        BiosampleAttribute cellLineAttribute = sample.extractAttribute(CELL_LINE_ATTRIBUTE_NAME);
        if (cellLineAttribute != null && !containsAttributeValue(cellLineAttribute, cellLineValues,
            isAnnotatedSamplesCollection)) {
          if (cellLineAttribute.getAttributeValueObject(isAnnotatedSamplesCollection).isValid()) {
            cellLineValues.add(cellLineAttribute.getAttributeValueObject(isAnnotatedSamplesCollection));
          }
        }

        BiosampleAttribute sexAttribute = sample.extractAttribute(SEX_ATTRIBUTE_NAME);
        if (sexAttribute != null && !containsAttributeValue(sexAttribute, sexValues, isAnnotatedSamplesCollection)) {
          if (sexAttribute.getAttributeValueObject(isAnnotatedSamplesCollection).isValid()) {
            sexValues.add(sexAttribute.getAttributeValueObject(isAnnotatedSamplesCollection));
          }
        }
      }

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

  private boolean containsAttributeValue(BiosampleAttribute attribute,
                                         List<BiosampleAttributeValue> attributeValuesList, boolean searchAnnotated) {
    for (BiosampleAttributeValue attributeValueObject : attributeValuesList) {
      if (!searchAnnotated) {
        if (attribute.getAttributeValue().toLowerCase().equals(attributeValueObject.getAttributeValue().toLowerCase())) {
          return true;
        }
      } else {
        if (attribute.getAttributeValueTermUri() != null && attributeValueObject.getAttributeValueTermUri() != null) {
          if (attribute.getAttributeValueTermUri().toLowerCase().equals(attributeValueObject.getAttributeValueTermUri().toLowerCase())) {
            return true;
          }
        }
      }
    }
    return false; // not found
  }

  private boolean containsBioproject(String bioprojectAccession, List<Bioproject> bioprojects) {
    for (Bioproject bioproject : bioprojects) {
      if (bioproject.getBioprojectAccession().equals(bioprojectAccession)) {
        return true;
      }
    }
    return false; // not found
  }

}