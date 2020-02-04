package org.metadatacenter;

import io.dropwizard.Configuration;
import org.metadatacenter.db.configuration.MongoDBConnection;

public class MetadataProviderApiConfiguration extends Configuration {

  private MongoDBConnection mongoDBConnection;

  public MongoDBConnection getMongoDBConnection() {
    return mongoDBConnection;
  }

  public void setMongoDBConnection(MongoDBConnection mongoDBConnection) {
    this.mongoDBConnection = mongoDBConnection;
  }
}
