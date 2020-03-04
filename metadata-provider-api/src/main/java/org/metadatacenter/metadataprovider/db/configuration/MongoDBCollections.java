package org.metadatacenter.metadataprovider.db.configuration;

public class MongoDBCollections {

  private String originalSamples;
  private String annotatedSamples;

  public MongoDBCollections() {}

  public String getOriginalSamples() {
    return originalSamples;
  }

  public String getAnnotatedSamples() {
    return annotatedSamples;
  }
}
