package org.metadatacenter;

import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import org.metadatacenter.db.BiosampleDAO;
import org.metadatacenter.db.MongoDBFactoryConnection;
import org.metadatacenter.db.MongoDBManaged;
import org.metadatacenter.resources.BiosampleResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MetadataProviderApiApplication extends Application<MetadataProviderApiConfiguration> {

  private static final Logger logger = LoggerFactory.getLogger(MetadataProviderApiApplication.class);

    public static void main(final String[] args) throws Exception {
      logger.info("Starting Metadata Provider API");
      new MetadataProviderApiApplication().run(args);
    }

    @Override
    public String getName() {
        return "Metadata Provider API";
    }

    @Override
    public void initialize(final Bootstrap<MetadataProviderApiConfiguration> bootstrap) {
        // TODO: application initialization
    }

    @Override
    public void run(final MetadataProviderApiConfiguration configuration,
                    final Environment environment) {

      final MongoDBFactoryConnection mongoDBFactoryConnection =
          new MongoDBFactoryConnection(configuration.getMongoDBConnection());

      final MongoDBManaged mongoDBManaged = new MongoDBManaged(mongoDBFactoryConnection.getClient());
      environment.lifecycle().manage(mongoDBManaged);

      String samplesDB = configuration.getMongoDBConnection().getDatabase();
      String originalSamplesCollection = configuration.getMongoDBConnection().getCollections().getOriginalSamples();
      String annotatedSamplesCollection = configuration.getMongoDBConnection().getCollections().getOriginalSamples();

      final BiosampleDAO originalSamplesDAO = new BiosampleDAO(mongoDBFactoryConnection.getClient().
          getDatabase(samplesDB).getCollection(originalSamplesCollection));

      final BiosampleDAO annotatedSamplesDAO = new BiosampleDAO(mongoDBFactoryConnection.getClient().
          getDatabase(samplesDB).getCollection(annotatedSamplesCollection));

      // Register resources
      final BiosampleResource sampleResource = new BiosampleResource(originalSamplesDAO, annotatedSamplesDAO);
        environment.jersey().register(sampleResource);



}
}
