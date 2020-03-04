package org.metadatacenter.metadataprovider;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.dropwizard.Configuration;
import io.federecio.dropwizard.swagger.SwaggerBundleConfiguration;
import org.metadatacenter.metadataprovider.db.configuration.MongoDBConnection;

public class MetadataProviderApiConfiguration extends Configuration {

  private MongoDBConnection mongoDBConnection;

  @JsonProperty("swagger")
  public SwaggerBundleConfiguration swaggerBundleConfiguration;

  public MongoDBConnection getMongoDBConnection() {
    return mongoDBConnection;
  }

  public void setMongoDBConnection(MongoDBConnection mongoDBConnection) {
    this.mongoDBConnection = mongoDBConnection;
  }
}
