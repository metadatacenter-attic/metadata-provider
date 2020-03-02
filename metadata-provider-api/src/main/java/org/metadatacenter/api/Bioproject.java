package org.metadatacenter.api;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Bioproject {

  @JsonProperty("bioprojectAccession")
  private String bioprojectAccession;

  // Generated attributes
  private String bioprojectUrl;

  public Bioproject() {
    // Jackson deserialization
  }

  public Bioproject(String bioprojectAccession) {
    this.bioprojectAccession = bioprojectAccession;
    this.bioprojectUrl = "https://www.ncbi.nlm.nih.gov/bioproject/" + getBioprojectAccession();
  }

  public String getBioprojectAccession() {
    return bioprojectAccession;
  }

  public String getBioprojectUrl() {
    return bioprojectUrl;
  }
}