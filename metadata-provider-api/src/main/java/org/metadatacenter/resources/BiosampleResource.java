package org.metadatacenter.resources;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.metadatacenter.api.Biosample;
import org.metadatacenter.db.BiosampleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/biosample")
@Produces(MediaType.APPLICATION_JSON)
public class BiosampleResource {

  private static final Logger logger = LoggerFactory.getLogger(BiosampleResource.class);

  private final BiosampleService originalSamplesService;
  private final BiosampleService annotatedSamplesService;

  public BiosampleResource(BiosampleService originalSamplesService, BiosampleService annotatedSamplesService) {
    this.originalSamplesService = originalSamplesService;
    this.annotatedSamplesService = annotatedSamplesService;
  }

  // TODO: extend to return annotated samples too
  @GET
  @Path("/all")
  @Timed
  public Response getAll() {
    try {
      final List<Biosample> samplesFound = originalSamplesService.getAll();
      return Response.ok(samplesFound).build();
    } catch (JsonProcessingException e) {
      logger.error(e.getMessage());
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GET
  @Path("/search")
  @Timed
  public Response search() {
    try {
      // We will represent the attribute-value pairs as a map

      Map<String, String> attributesAndValuesFilter = new HashMap<>();

      attributesAndValuesFilter.put("disease", "liver cancer");
      attributesAndValuesFilter.put("sex", "female");

      final List<Biosample> samplesFound = originalSamplesService.search(attributesAndValuesFilter);
      logger.info(samplesFound.size() + " samples found");

      return Response.ok(samplesFound).build();
    } catch (JsonProcessingException e) {
      logger.error(e.getMessage());
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
    }
  }

}
