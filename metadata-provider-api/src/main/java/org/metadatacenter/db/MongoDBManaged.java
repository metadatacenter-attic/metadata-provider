package org.metadatacenter.db;

import com.mongodb.client.MongoClient;
import io.dropwizard.lifecycle.Managed;

/**
 * Manages the MongoDB connection
 */

public class MongoDBManaged implements Managed {

  /**
   * The mongoDB client.
   */
  private MongoClient mongoClient;

  public MongoDBManaged(final MongoClient mongoClient) {
    this.mongoClient = mongoClient;
  }

  @Override
  public void start() throws Exception {
  }

  @Override
  public void stop() throws Exception {
    mongoClient.close();
  }

}
