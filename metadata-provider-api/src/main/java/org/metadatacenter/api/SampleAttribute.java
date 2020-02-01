package org.metadatacenter.api;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SampleAttribute {

  private String name;
  private String value;

  public SampleAttribute() {
    // Jackson deserialization
  }

  public SampleAttribute(String name, String value) {
    this.name = name;
    this.value = value;
  }

  @JsonProperty
  public String getName() {
    return name;
  }

  @JsonProperty
  public String getValue() {
    return value;
  }
}
