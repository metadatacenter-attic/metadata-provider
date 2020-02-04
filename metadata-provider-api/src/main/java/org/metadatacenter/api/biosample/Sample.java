package org.metadatacenter.api.biosample;

import java.util.List;

public class Sample {

  private String id;
  private String title;
  private List<SampleAttribute> attributes;

  public Sample() {
    // Jackson deserialization
  }

  public String getId() {
    return id;
  }

  public String getTitle() {
    return title;
  }

  public List<SampleAttribute> getAttributes() {
    return attributes;
  }

  public Sample(String id, String title, List<SampleAttribute> attributes) {
    this.id = id;
    this.title = title;
    this.attributes = attributes;
  }




}
