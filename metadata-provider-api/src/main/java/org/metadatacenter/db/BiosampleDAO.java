package org.metadatacenter.db;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;

public class BiosampleDAO {

  private final MongoCollection<Document> samplesCollection;
  private final ObjectMapper mapper = new ObjectMapper();

  public BiosampleDAO(MongoCollection<Document> samplesCollection) {
    this.samplesCollection = samplesCollection;
  }

  public List<JsonNode> getAll() throws JsonProcessingException {

    final MongoCursor<Document> samplesDocs = samplesCollection.find().iterator();
    final List<JsonNode> samplesFound = new ArrayList<>();
    try {
      while (samplesDocs.hasNext()) {
        final Document sample = samplesDocs.next();
        samplesFound.add(mapper.readTree(sample.toJson()));
      }
    } finally {
      samplesDocs.close();
    }
    return samplesFound;

  }


}
