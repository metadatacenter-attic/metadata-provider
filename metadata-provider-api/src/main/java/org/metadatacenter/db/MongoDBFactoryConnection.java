package org.metadatacenter.db;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.metadatacenter.db.configuration.MongoDBConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MongoDBFactoryConnection {

  private static final Logger logger = LoggerFactory.getLogger(MongoDBFactoryConnection.class);

  private MongoDBConnection mongoDBConnection;

  public MongoDBFactoryConnection(final MongoDBConnection mongoDBConnection) {
    this.mongoDBConnection = mongoDBConnection;
  }

  public MongoClient getClient() {

    logger.info("Creating mongoDB client");

    final MongoClient mongoClient = MongoClients.create("mongodb://" +
        mongoDBConnection.getHost() + ":" + mongoDBConnection.getPort());

    return mongoClient;
  }

}
