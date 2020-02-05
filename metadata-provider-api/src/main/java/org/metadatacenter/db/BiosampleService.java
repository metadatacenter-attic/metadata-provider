package org.metadatacenter.db;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import org.bson.BsonDocument;
import org.bson.Document;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.conversions.Bson;
import org.metadatacenter.api.Biosample;
import org.metadatacenter.db.util.MongoDBFactoryConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.mongodb.client.model.Filters.*;

public class BiosampleService {

  private static final Logger logger = LoggerFactory.getLogger(BiosampleService.class);

  private final MongoCollection<Document> samplesCollection;
  private final ObjectMapper mapper = new ObjectMapper();

  public BiosampleService(MongoCollection<Document> samplesCollection) {
    this.samplesCollection = samplesCollection;
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
      attNameValueFilters.add(
          elemMatch("attributes", and(eq("attributeName", attributeName), eq("attributeValue", attributeValue))));
    }


    Bson searchFilter = and(attNameValueFilters);
    BsonDocument bsonDocument = searchFilter.toBsonDocument(BsonDocument.class, MongoClientSettings.getDefaultCodecRegistry());
    logger.info("Search filter: " + bsonDocument.toJson());
    MongoCursor<Document> iterator = samplesCollection.find(searchFilter).iterator();

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

}