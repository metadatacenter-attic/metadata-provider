package org.metadatacenter.db;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Projections;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.metadatacenter.api.Biosample;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.mongodb.client.model.Filters.*;

public class BiosampleService {

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

    MongoCursor<Document> iterator = samplesCollection.find(and(attNameValueFilters)).iterator();

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