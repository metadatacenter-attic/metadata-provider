package org.metadatacenter.db;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import org.bson.Document;
import org.metadatacenter.api.biosample.Sample;

import java.util.ArrayList;
import java.util.List;

public class BiosampleService {

  private final MongoCollection<Document> samplesCollection;
  private final ObjectMapper mapper = new ObjectMapper();

  public BiosampleService(MongoCollection<Document> samplesCollection) {
    this.samplesCollection = samplesCollection;
  }

  public List<JsonNode> getAll() throws JsonProcessingException {

    final MongoCursor<Document> samplesDocs = samplesCollection.find().iterator();
    final List<JsonNode> samplesFound = new ArrayList<>();
    try {
      while (samplesDocs.hasNext()) {
        final Document sampleDoc = samplesDocs.next();

        samplesFound.add(mapper.readTree(sampleDoc.toJson()));

        Sample sample = mapper.readValue(sampleDoc.toJson(), Sample.class);
        int a = 2;

      }
    } finally {
      samplesDocs.close();
    }
    return samplesFound;

  }


}
