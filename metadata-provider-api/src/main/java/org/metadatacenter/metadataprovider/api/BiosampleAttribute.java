package org.metadatacenter.metadataprovider.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class BiosampleAttribute {

  // Properties shared by original and annotated samples
  @JsonProperty("attributeName")
  private String attributeName;
  @JsonProperty("attributeValue")
  private String attributeValue;
  // Properties for annotated samples
  @JsonProperty("attributeNameTermUri")
  private String attributeNameTermUri;
  @JsonProperty("attributeNameTermLabel")
  private String attributeNameTermLabel;
  //@JsonIgnore
  private List<String> attributeNameTermAltLabels;
  @JsonProperty("attributeNameTermSource")
  private String attributeNameTermSource;
  @JsonProperty("attributeValueTermUri")
  private String attributeValueTermUri;
  @JsonProperty("attributeValueTermLabel")
  private String attributeValueTermLabel;
  //@JsonIgnore
  private List<String> attributeValueTermAltLabels;
  @JsonProperty("attributeValueTermSource")
  private String attributeValueTermSource;

  public BiosampleAttribute() {
    // Jackson deserialization
  }

  public String getAttributeName() {
    return attributeName;
  }

  public String getAttributeValue() {
    return attributeValue;
  }

  public String getAttributeNameTermUri() {
    return attributeNameTermUri;
  }

  public String getAttributeNameTermLabel() {
    return attributeNameTermLabel;
  }

  public List<String> getAttributeNameTermAltLabels() {
    return attributeNameTermAltLabels;
  }

  public String getAttributeNameTermSource() {
    return attributeNameTermSource;
  }

  public String getAttributeValueTermUri() {
    return attributeValueTermUri;
  }

  public String getAttributeValueTermLabel() {
    return attributeValueTermLabel;
  }

  public List<String> getAttributeValueTermAltLabels() {
    return attributeValueTermAltLabels;
  }

  public String getAttributeValueTermSource() {
    return attributeValueTermSource;
  }

}