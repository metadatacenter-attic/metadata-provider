package org.metadatacenter.resources;

import com.codahale.metrics.annotation.Timed;
import org.metadatacenter.api.Sample;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.Optional;

@Path("/samples")
@Produces(MediaType.APPLICATION_JSON)
public class SampleResource {

  @GET
  @Timed
  public Sample sayHello(@QueryParam("name") Optional<String> name) {
    return new Sample("123", "Beautiful Sample", new ArrayList<>());
  }

}
