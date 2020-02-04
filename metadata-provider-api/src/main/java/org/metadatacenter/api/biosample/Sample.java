package org.metadatacenter.api.biosample;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Sample {

  private String biosampleAccession;
  private String bioprojectAccession;
  private String sampleName;
  private String sampleTitle;
  private List<SampleAttribute> attributes;

  public Sample() {
    // Jackson deserialization
  }

  @JsonProperty("BioSample")
  private void unpackBioSample(Map<String,Object> biosample) {
    this.biosampleAccession = (String) biosample.get("@accession");


    if (biosample.get("Links") != null) {
      for (Map<String,Object> link:  (List<Map<String,Object>>) biosample.get("Links")) {
        if (((String) link.get("@target")).compareTo("bioproject") == 0) {
          this.bioprojectAccession = (String) link.get("#text");
        }
      }
    }





  }



}
