package org.metadatacenter.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(value = {"_id"})
public class Biosample {

  @JsonProperty("biosampleAccession")
  private String biosampleAccession;
  @JsonProperty("bioprojectAccession")
  private String bioprojectAccession;
  @JsonProperty("sampleName")
  private String sampleName;
  @JsonProperty("sampleTitle")
  private String sampleTitle;
  @JsonProperty("organism")
  private String organism;
  @JsonProperty("attributes")
  private List<BiosampleAttribute> attributes;

  // Generated attributes
  private String biosampleUrl;

  public Biosample() {
    // Jackson deserialization
  }

  public String getBiosampleAccession() {
    return biosampleAccession;
  }

  public String getBioprojectAccession() {
    return bioprojectAccession;
  }

  public String getSampleName() {
    return sampleName;
  }

  public String getSampleTitle() {
    return sampleTitle;
  }

  public String getOrganism() {
    return organism;
  }

  public List<BiosampleAttribute> getAttributes() {
    return attributes;
  }

  public String getBiosampleUrl() {
    return "https://www.ncbi.nlm.nih.gov/biosample/" + getBiosampleAccession();
  }
}
