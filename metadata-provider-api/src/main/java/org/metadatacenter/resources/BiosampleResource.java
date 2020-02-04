package org.metadatacenter.resources;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.metadatacenter.api.biosample.Sample;
import org.metadatacenter.db.BiosampleDAO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Path("/biosample")
@Produces(MediaType.APPLICATION_JSON)
public class BiosampleResource {

  private static final Logger logger = LoggerFactory.getLogger(BiosampleResource.class);

  private final BiosampleDAO originalSamplesDAO;
  private final BiosampleDAO annotatedSamplesDAO;

  public BiosampleResource(BiosampleDAO originalSamplesDAO, BiosampleDAO annotatedSamplesDAO) {
    this.originalSamplesDAO = originalSamplesDAO;
    this.annotatedSamplesDAO = annotatedSamplesDAO;
  }

  @GET
  @Path("/all")
  @Timed
  public Response search() {
    try {
      logger.info("List all samples");
      final List<JsonNode> samplesFound = originalSamplesDAO.getAll();
      return Response.ok(samplesFound).build();
    } catch (JsonProcessingException e) {
      logger.error(e.getMessage());
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
    }
  }

}
