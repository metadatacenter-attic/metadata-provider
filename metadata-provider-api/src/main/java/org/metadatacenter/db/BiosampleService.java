package org.metadatacenter.db;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import org.bson.BsonDocument;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.metadatacenter.api.Biosample;
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
  // Initialized in constructor
  private final String ATTRIBUTE_NAME_FIELD;
  private final String ATTRIBUTE_VALUE_FIELD;

  public BiosampleService(MongoCollection<Document> samplesCollection, boolean isAnnotatedSamplesCollection) {
    this.samplesCollection = samplesCollection;
    this.isAnnotatedSamplesCollection = isAnnotatedSamplesCollection;
    final String ATTRIBUTE_NAME_FIELD_ORIGINAL = "attributeName";
    final String ATTRIBUTE_VALUE_FIELD_ORIGINAL = "attributeValue";
    final String ATTRIBUTE_NAME_FIELD_ANNOTATED = "attributeNameTermUri";
    final String ATTRIBUTE_VALUE_FIELD_ANNOTATED = "attributeValueTermUri";

    if (this.isAnnotatedSamplesCollection) {
      this.ATTRIBUTE_NAME_FIELD = ATTRIBUTE_NAME_FIELD_ANNOTATED;
      this.ATTRIBUTE_VALUE_FIELD = ATTRIBUTE_VALUE_FIELD_ANNOTATED;
    } else {
      this.ATTRIBUTE_NAME_FIELD = ATTRIBUTE_NAME_FIELD_ORIGINAL;
      this.ATTRIBUTE_VALUE_FIELD = ATTRIBUTE_VALUE_FIELD_ORIGINAL;
    }
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

  public List<Biosample> search(Map<String, String> attributesAndValuesFilter) throws JsonProcessingException {
    final List<Biosample> samples = new ArrayList<>();

    List<Bson> attNameValueFilters = new ArrayList<>();

    for (String attributeName : attributesAndValuesFilter.keySet()) {
      String attributeValue = attributesAndValuesFilter.get(attributeName);
      String attributeValueForRegex =  "^" + escapeSpecialRegexChars(attributeValue) + "$";
      attNameValueFilters.add(
          elemMatch("attributes",
              and(eq(ATTRIBUTE_NAME_FIELD, attributeName),
                  regex(ATTRIBUTE_VALUE_FIELD, attributeValueForRegex, "i")))); // Exact match, case insensitive search
    }
    Bson searchFilter = and(attNameValueFilters);
    BsonDocument bsonDocument = searchFilter.toBsonDocument(BsonDocument.class,
        MongoClientSettings.getDefaultCodecRegistry());
    logger.info("Search filter: " + bsonDocument.toJson());
    MongoCursor<Document> iterator = samplesCollection.find(searchFilter).sort(orderBy(ascending(SAMPLE_ID_FIELD))).iterator();

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

}