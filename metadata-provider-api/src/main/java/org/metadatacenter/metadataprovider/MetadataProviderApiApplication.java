package org.metadatacenter.metadataprovider;

import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.federecio.dropwizard.swagger.SwaggerBundle;
import io.federecio.dropwizard.swagger.SwaggerBundleConfiguration;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import org.metadatacenter.metadataprovider.db.BiosampleService;
import org.metadatacenter.metadataprovider.db.util.MongoDBFactoryConnection;
import org.metadatacenter.metadataprovider.db.util.MongoDBManaged;
import org.metadatacenter.metadataprovider.resources.BiosampleResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration;
import java.util.EnumSet;

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
    // Swagger initialization
    bootstrap.addBundle(new SwaggerBundle<MetadataProviderApiConfiguration>() {
      @Override
      protected SwaggerBundleConfiguration getSwaggerBundleConfiguration(MetadataProviderApiConfiguration configuration) {
        return configuration.swaggerBundleConfiguration;
      }
    });
  }

  @Override
  public void run(final MetadataProviderApiConfiguration configuration,
                  final Environment environment) {

    // Enable CORS headers
    final FilterRegistration.Dynamic cors =
        environment.servlets().addFilter("CORS", CrossOriginFilter.class);

    // Configure CORS parameters
    cors.setInitParameter("allowedOrigins", "*");
    cors.setInitParameter("allowedHeaders", "X-Requested-With,Content-Type,Accept,Origin");
    cors.setInitParameter("allowedMethods", "OPTIONS,GET,PUT,POST,DELETE,HEAD");

    // Add URL mapping
    cors.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), true, "/*");


    final MongoDBFactoryConnection mongoDBFactoryConnection =
        new MongoDBFactoryConnection(configuration.getMongoDBConnection());

    final MongoDBManaged mongoDBManaged = new MongoDBManaged(mongoDBFactoryConnection.getClient());
    environment.lifecycle().manage(mongoDBManaged);

    String samplesDB = configuration.getMongoDBConnection().getDatabase();
    String originalSamplesCollection = configuration.getMongoDBConnection().getCollections().getOriginalSamples();
    String annotatedSamplesCollection = configuration.getMongoDBConnection().getCollections().getAnnotatedSamples();

    final BiosampleService originalSamplesDAO = new BiosampleService(mongoDBFactoryConnection.getClient().
        getDatabase(samplesDB).getCollection(originalSamplesCollection), false);

    final BiosampleService annotatedSamplesDAO = new BiosampleService(mongoDBFactoryConnection.getClient().
        getDatabase(samplesDB).getCollection(annotatedSamplesCollection), true);

    // Register resources
    final BiosampleResource sampleResource = new BiosampleResource(originalSamplesDAO, annotatedSamplesDAO);
    environment.jersey().register(sampleResource);


  }
}
