package io.dropwizard;

import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

public class MetadataProviderApiApplication extends Application<MetadataProviderApiConfiguration> {

    public static void main(final String[] args) throws Exception {
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
        // TODO: implement application
    }

}
