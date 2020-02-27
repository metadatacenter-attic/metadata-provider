package org.metadatacenter.resources;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.metadatacenter.api.Biosample;
import org.metadatacenter.db.BiosampleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
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

  public enum BiosamplesDB {
    original,
    annotated
  }

  public BiosampleResource(BiosampleService originalSamplesService, BiosampleService annotatedSamplesService) {
    this.originalSamplesService = originalSamplesService;
    this.annotatedSamplesService = annotatedSamplesService;
  }

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
  public Response search(@QueryParam("q") @NotEmpty String q, @QueryParam("db") @DefaultValue("annotated") BiosamplesDB db) {
    BiosampleService service;
    boolean isAnnotatedSamplesQuery;
    if (db.equals(BiosamplesDB.annotated)) {
      logger.info("Selected DB: " + BiosamplesDB.annotated);
      service = annotatedSamplesService;
      isAnnotatedSamplesQuery = true;
    }
    else {
      logger.info("Selected DB: " + BiosamplesDB.original);
      service = originalSamplesService;
      isAnnotatedSamplesQuery = false;
    }
    try {
      Map<String, String> attributeNameValuePairs = QueryUtils.parseQuery(q, isAnnotatedSamplesQuery);
      final List<Biosample> samplesFound = service.search(attributeNameValuePairs);
      logger.info(samplesFound.size() + " samples found");
      return Response.ok(samplesFound).build();
    }
    catch (BadRequestException e) {
      logger.error(e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST).build();
    }
    catch (JsonProcessingException e) {
      logger.error(e.getMessage());
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
    }
  }

}
