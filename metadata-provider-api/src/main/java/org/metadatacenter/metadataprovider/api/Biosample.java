package org.metadatacenter.metadataprovider.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(value = {"_id"})
public class Biosample {

  private String biosampleAccession;
  private String bioprojectAccession;
  private Bioproject bioproject;
  private String sampleName;
  private String sampleTitle;
  private String organism;
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

  @JsonInclude(JsonInclude.Include.NON_NULL)
  public Bioproject getBioproject() { return bioproject; }

  public void setBioproject(Bioproject bioproject) { this.bioproject = bioproject; }

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

  public BiosampleAttribute extractAttribute(String attributeName) {
    for (BiosampleAttribute attribute : attributes) {
      if (attribute.getAttributeName().toLowerCase().equals(attributeName.toLowerCase())) {
        return attribute;
      }
    }
    return null;
  }

}
