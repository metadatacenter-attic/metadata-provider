package org.metadatacenter.metadataprovider.resources;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.metadatacenter.metadataprovider.api.Biosample;
import org.metadatacenter.metadataprovider.api.BiosampleSearchResult;
import org.metadatacenter.metadataprovider.db.BiosampleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.constraints.NotEmpty;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.Map;

@Path("/biosample")
@Api("/biosample")
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
  @ApiOperation("Get all samples")
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

  /* Deprecated */
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
      final List<Biosample> samplesFound = service.searchDeprecated(attributeNameValuePairs);
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

  @GET
  @Path("/query")
  @Timed
  public Response query(@QueryParam("q") @NotEmpty String q, @QueryParam("db") @DefaultValue("annotated") BiosamplesDB db,
                         @QueryParam("includeDetails") @DefaultValue("false") boolean includeDetails) {
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
      final BiosampleSearchResult samplesFound = service.search(attributeNameValuePairs, includeDetails);
      logger.info(samplesFound.getBiosamples().size() + " samples found");
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
