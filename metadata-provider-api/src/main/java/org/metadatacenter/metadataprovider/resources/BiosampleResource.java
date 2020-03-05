package org.metadatacenter.metadataprovider.resources;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.metadatacenter.metadataprovider.api.ApiOutput;
import org.metadatacenter.metadataprovider.api.Biosample;
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

  public enum Aggregation {
    project,
    disease,
    tissue,
    cellType,
    cellLine,
    sex
  }

  public BiosampleResource(BiosampleService originalSamplesService, BiosampleService annotatedSamplesService) {
    this.originalSamplesService = originalSamplesService;
    this.annotatedSamplesService = annotatedSamplesService;
  }

  @GET
  @ApiOperation("Find biosample by accession number")
  @Path("{accession}")
  @Timed
  public Response findBiosampleByAccession(@PathParam("accession") String accession,
                                            @QueryParam("db") @DefaultValue("annotated") BiosamplesDB db) {
    BiosampleService service;
    boolean isAnnotatedSamplesQuery;
    if (db.equals(BiosamplesDB.annotated)) {
      service = annotatedSamplesService;
    }
    else {
      service = originalSamplesService;
    }
    try {
      Biosample sample = service.findByAccession(accession);
      if (sample != null) {
        return Response.ok(sample).build();
      }
      else {
        return Response.status(Response.Status.NOT_FOUND).build();
      }
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
  @ApiOperation("Search biosamples by attribute name and value")
  @Path("/search")
  @Timed
  public Response search(@QueryParam("q") @NotEmpty String q,
                            @QueryParam("db") @DefaultValue("annotated") BiosamplesDB db,
                            @QueryParam("include_accessions") @DefaultValue("false") boolean includeAccessions,
                            @QueryParam("aggregations") List<Aggregation> aggregations,
                            @QueryParam("offset") @DefaultValue("0") int offset,
                            @QueryParam("limit") @DefaultValue("25") int limit) {
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
      ApiOutput samplesFound;
      if (q.equals("*")) { // Retrieve all documents. Note that in this case we don't include accessions or allow aggregations
        samplesFound = service.findAll(offset, limit);
      }
      else {
        Map<String, String> attributeNameValuePairs = QueryUtils.parseQuery(q, isAnnotatedSamplesQuery);
        samplesFound = service.search(attributeNameValuePairs, includeAccessions, aggregations, offset, limit);
      }
      return Response.ok(samplesFound).build();
    }
    catch (BadRequestException e) {
      logger.error(e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).type(MediaType.TEXT_PLAIN_TYPE).build();
    }
    catch (JsonProcessingException e) {
      logger.error(e.getMessage());
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
    }
  }

}
