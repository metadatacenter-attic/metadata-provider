package org.metadatacenter.api;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BiosampleAttribute {

  @JsonProperty("attributeName")
  private String attributeName;
  @JsonProperty("attributeValue")
  private String attributeValue;

  public BiosampleAttribute() {
    // Jackson deserialization
  }

  public String getAttributeName() {
    return attributeName;
  }

  public String getAttributeValue() {
    return attributeValue;
  }

}
