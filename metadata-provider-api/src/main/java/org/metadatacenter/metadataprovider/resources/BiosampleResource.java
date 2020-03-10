package org.metadatacenter.metadataprovider.resources;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.swagger.annotations.*;
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

@SwaggerDefinition(
    info = @Info(
        title = "Metadata Provider API",
        version = "prototype",
        description = "Prototype API to query a subset of NCBI BioSample metadata records that were processed " +
            "using semantic technology to increase their value.\n\nThe current database contains " +
            "<strong>4,346 records</strong> for three diseases: <i>hepatocellular carcinoma</i>, <i>myelodysplasia</i>, " +
            "and <i>systemic lupus erythematosus</i>. The original records were downloaded on " +
            "February 2, 2020 from the NCBI's FTP server (https://ftp.ncbi.nih.gov/biosample).",
        termsOfService = "/biosample/tos",
        // license = @License(name = "Apache 2.0", url = "http://foo.bar"),
        contact = @Contact(name = " ", email = "marcosmr@stanford.edu")
    )
)

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
    organization,
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
  public Response findBiosampleByAccession(@ApiParam(example = "SAMEA104169478") @PathParam("accession") String accession,
                                           @ApiParam(value = "Return BioProject details") @QueryParam("include_bioproject") @DefaultValue("false") boolean includeBioprojectDetails,
                                           @QueryParam("db") @DefaultValue("annotated") BiosamplesDB db) {
    BiosampleService service;
    if (db.equals(BiosamplesDB.annotated)) {
      service = annotatedSamplesService;
    } else {
      service = originalSamplesService;
    }
    try {
      Biosample sample = service.findByAccession(accession);

      if (!includeBioprojectDetails) {
        sample.setBioproject(null);
      }

      if (sample != null) {
        return Response.ok(sample).build();
      } else {
        return Response.status(Response.Status.NOT_FOUND).build();
      }
    } catch (BadRequestException e) {
      logger.error(e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST).build();
    } catch (JsonProcessingException e) {
      logger.error(e.getMessage());
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GET
  @ApiOperation("Search biosamples by attribute name and value")
  @Path("/search")
  @Timed
  public Response search(@ApiParam(value = "Search query in the format: <i>attributeName1=attributeValue1 AND " +
      "attributeName2=attributeValue2 AND ... AND attributeNameN=attributeValueN</i>. Note that the attribute names and " +
      "values can be expressed using either free text (e.g., <i>disease=HCC</i>) or CURIEs (e.g., <i>biolink:Disease=mondo:0007256</i>)",
      example = "disease=HCC AND tissue=liver") @QueryParam("q") @NotEmpty String q,
                         @ApiParam(value = "Target database") @QueryParam("db") @DefaultValue("annotated") BiosamplesDB db,
                         @ApiParam(value = "Return a list with all the biosample accessions that match the query") @QueryParam("include_accessions") @DefaultValue("false") boolean includeAccessions,
                         @ApiParam(value = "Return BioProject details") @QueryParam("include_bioproject") @DefaultValue("false") boolean includeBioprojectDetails,
                         @ApiParam(value = "Return aggregated results for biosample attributes, bioprojects, or organizations") @QueryParam("aggregations") List<Aggregation> aggregations,
                         @QueryParam("offset") @DefaultValue("0") int offset,
                         @QueryParam("limit") @DefaultValue("25") int limit) {
    BiosampleService service;
    boolean isAnnotatedSamplesQuery;
    if (db.equals(BiosamplesDB.annotated)) {
      logger.info("Selected DB: " + BiosamplesDB.annotated);
      service = annotatedSamplesService;
      isAnnotatedSamplesQuery = true;
    } else {
      logger.info("Selected DB: " + BiosamplesDB.original);
      service = originalSamplesService;
      isAnnotatedSamplesQuery = false;
    }
    try {
      Map<String, String> attributeNameValuePairs = QueryUtils.parseQuery(q, isAnnotatedSamplesQuery);
      ApiOutput samplesFound = service.search(attributeNameValuePairs, includeAccessions, includeBioprojectDetails, aggregations, offset, limit);
      service.search(attributeNameValuePairs, includeAccessions, includeBioprojectDetails, aggregations, offset, limit);
      return Response.ok(samplesFound).build();
    } catch (BadRequestException e) {
      logger.error(e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).type(MediaType.TEXT_PLAIN_TYPE).build();
    } catch (JsonProcessingException e) {
      logger.error(e.getMessage());
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GET
  @Path("/tos")
  @ApiOperation(hidden = true, value = "Terms of service")
  @Timed
  public Response tos() {
    String tos = "Metadata Provider (\"the Service\") is provided by the Stanford Center for Biomedical Informatics " +
        "Research (\"the Provider\"). The Provider authorizes you to access and use the Service under the conditions " +
        "set forth below.\n" +
        "\n" +
        "YOU ACKNOWLEDGE THAT THE SERVICE IS EXPERIMENTAL AND ACADEMIC IN NATURE, AND IS NOT LICENSED BY ANY " +
        "REGULATORY BODY. IT IS PROVIDED \"AS-IS\" WITHOUT WARRANTY OF" +
        " ANY KIND. THE PROVIDER MAKES NO REPRESENTATIONS OR WARRANTIES CONCERNING THE SERVICE OR ANY OTHER " +
        "MATTER WHATSOEVER, INCLUDING WITHOUT LIMITATION ANY EXPRESS, IMPLIED OR STATUTORY WARRANTIES OF " +
        "MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT OF THIRD PARTY RIGHTS, TITLE, " +
        "ACCURACY, COMPLETENESS OR ARISING OUT OF COURSE OF CONDUCT OR TRADE CUSTOM OR USAGE, AND DISCLAIMS ALL " +
        "SUCH EXPRESS, IMPLIED OR STATUTORY WARRANTIES. THE PROVIDER MAKES NO WARRANTY OR REPRESENTATION THAT " +
        "YOUR USE OF THE SERVICE WILL NOT INFRINGE UPON THE INTELLECTUAL PROPERTY OR OTHER RIGHTS OF ANY THIRD " +
        "PARTY. FURTHER, THE PROVIDER SHALL NOT BE LIABLE IN ANY MANNER WHATSOEVER FOR ANY DIRECT, INDIRECT, " +
        "INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES ARISING OUT OF OR IN ANY WAY RELATED TO THE " +
        "SERVICE, THE USE OF, OR INABILITY TO USE, ANY OF THE INFORMATION OR DATA CONTAINED OR REFERENCED IN THE " +
        "SERVICE OR ANY INFORMATION OR DATA THAT IS PROVIDED THROUGH LINKED WEBSITES, OR ANY OTHER MATTER. THE " +
        "FOREGOING EXCLUSIONS AND LIMITATIONS SHALL APPLY TO ALL CLAIMS AND ACTIONS OF ANY KIND AND ON ANY THEORY" +
        " OF LIABILITY, WHETHER BASED ON CONTRACT, TORT OR ANY OTHER GROUNDS, AND REGARDLESS OF WHETHER A PARTY " +
        "HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES, AND NOTWITHSTANDING ANY FAILURE OF ESSENTIAL " +
        "PURPOSE OF ANY LIMITED REMEDY. BY USING THE SERVICE, YOU FURTHER AGREE THAT EACH WARRANTY DISCLAIMER, " +
        "EXCLUSION OF DAMAGES OR OTHER LIMITATION OF LIABILITY HEREIN IS INTENDED TO BE SEVERABLE AND INDEPENDENT" +
        " OF THE OTHER CLAUSES OR SENTENCES BECAUSE THEY EACH REPRESENT SEPARATE ELEMENTS OF RISK ALLOCATION " +
        "BETWEEN THE PARTIES.\n" +
        "\n" +
        "You also agree that you will ensure that any copies of documents you generate by using the Service shall" +
        " retain and display all copyright and other proprietary notices contained therein. The Provider has " +
        "attempted to provide accurate and current information on the Service. However, the Provider makes no " +
        "representations or warranties that the information contained or published via the Service will be " +
        "suitable for your specific purposes or for any other purposes. You agree to indemnify, defend, and hold " +
        "the Provider harmless from all claims, damages, liabilities and expenses, including without limitation " +
        "reasonable attorney's fees and costs, whether or not a lawsuit or other proceeding is filed, that in any" +
        " way arise out of or relate to your use of the Service and/or use of the other third party websites " +
        "referenced herein.\n" +
        "\n" +
        "The Service may contain information from third party services, which may or may not be marked with the " +
        "name of the source. Such information does not necessarily represent the views or opinions of the " +
        "Provider, and the Provider shall have no responsibility whatsoever for such information. All information" +
        " from third party services are the sole responsibility of the person or entity that provides and/or " +
        "maintains such service. As a user of the Service, you are solely responsible for any information that " +
        "you display, generate, transmit or transfer while using the Service, and for the consequences of such " +
        "actions.\n" +
        "\n" +
        "Should any user of the Service provide general, scientific or other feedback information, whether in the" +
        " form of questions, comments, or suggestions to the Provider, regarding the content of the Service or " +
        "otherwise, such information shall not be deemed to be confidential or proprietary to you or to any other" +
        " party. The Provider shall have no obligation of any kind with respect to such information and the " +
        "Provider shall have the right, without limitation, to reproduce, use, disclose, merge, display, make " +
        "derivatives of and distribute such information to others. The Provider shall also have the right, " +
        "without limitation, to use and exploit such information, including ideas, concepts, know-how, " +
        "inventions, techniques or other materials contained in such information for any purpose whatsoever, " +
        "including but not limited to, making changes or improvements to the Service and/or developing, " +
        "manufacturing, marketing, selling or distributing products and technologies incorporating such " +
        "information. However, you agree that the Provider has no obligation whatsoever to respond to your " +
        "comments or to change or correct any information on the Service based on your comments.\n" +
        "\n" +
        "The Provider reserves the right to alter the content of the Service in any way, at any time and for any " +
        "reason, with or without prior notice to you, and the Provider will not be liable in any way for possible" +
        " consequences of such changes or for inaccuracies, typographical errors or omissions in the contents " +
        "hereof. Nothing contained herein shall be construed as conferring by implication, estoppel or otherwise " +
        "any license or right under any patent, trademark or other intellectual property of the Provider or any " +
        "third party. Except as expressly provided above, nothing contained herein shall be construed as " +
        "conferring any right or license under any copyrights.\n" +
        "\n" +
        "The Provider also reserves the right to modify these Terms of Use at any time and for any reason, with " +
        "or without prior notice to you. You should always review the most current Terms of Use herein before " +
        "using the Service. By using the Service, you agree to the current Terms of Use posted on this site. You " +
        "also agree that these Terms of Use constitute the entire agreement between you and the Provider " +
        "regarding the subject matter hereof and supersede all prior and contemporaneous understandings, oral or " +
        "written, regarding such subject matter. In addition, if any provision of these Terms of Use is found by " +
        "a court of competent jurisdiction to be invalid, void or unenforceable, the remaining provisions shall " +
        "remain in full force and effect, and the affected provision shall be revised so as to reflect the " +
        "original intent of the parties hereunder to the maximum extent permitted by applicable law.\n" +
        "\n" +
        "BY USING THE SERVICE, YOU ACKNOWLEDGE AND AGREE THAT YOU HAVE READ, UNDERSTOOD AND AGREE TO ALL OF THESE" +
        " TERMS OF USE.";
    return Response.ok(tos).build();
  }
}
