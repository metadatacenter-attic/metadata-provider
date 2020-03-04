package org.metadatacenter.metadataprovider.api;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(value = {"bioprojectAccession"})
public class UniqueBioproject implements Comparable<UniqueBioproject> {

  @JsonProperty("bioprojectAccession")
  private String bioprojectAccession;
  @JsonProperty("count")
  private int count;

  // Generated attributes
  private String bioprojectUrl;

  public UniqueBioproject() {
    // Jackson deserialization
  }

  public UniqueBioproject(String bioprojectAccession, int count) {
    this.bioprojectAccession = bioprojectAccession;
    this.count = count;
    this.bioprojectUrl = "https://www.ncbi.nlm.nih.gov/bioproject/" + getBioprojectAccession();
  }

  public String getBioprojectAccession() {
    return bioprojectAccession;
  }

  public String getBioprojectUrl() {
    return bioprojectUrl;
  }

  public int getCount() {
    return count;
  }

  public void setCount(int count) {
    this.count = count;
  }

  @Override
  public int compareTo(UniqueBioproject bioproject) {
    return Integer.compare(this.count, bioproject.getCount());
  }

}