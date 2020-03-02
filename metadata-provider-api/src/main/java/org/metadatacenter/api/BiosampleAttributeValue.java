package org.metadatacenter.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class BiosampleAttributeValue {

  @JsonProperty("attributeValue")
  private String attributeValue;
  @JsonProperty("attributeValueTermUri")
  private String attributeValueTermUri;
  @JsonProperty("attributeValueTermLabel")
  private String attributeValueTermLabel;
  @JsonProperty("attributeValueTermSource")
  private String attributeValueTermSource;

  public BiosampleAttributeValue() {
    // Jackson deserialization
  }

  // Original value
  public BiosampleAttributeValue(String attributeValue) {
    this.attributeValue = attributeValue;
  }

  // Annotated value
  public BiosampleAttributeValue(String attributeValueTermUri, String attributeValueTermLabel,
                                 String attributeValueTermSource) {
    this.attributeValueTermUri = attributeValueTermUri;
    this.attributeValueTermLabel = attributeValueTermLabel;
    this.attributeValueTermSource = attributeValueTermSource;
  }

  public String getAttributeValue() {
    return attributeValue;
  }

  public String getAttributeValueTermUri() {
    return attributeValueTermUri;
  }

  public String getAttributeValueTermLabel() {
    return attributeValueTermLabel;
  }

  public String getAttributeValueTermSource() {
    return attributeValueTermSource;
  }

  public boolean isValid() {
    if (attributeValue != null || attributeValueTermUri != null) {
      return true;
    }
    else {
      return false;
    }
  }
}
