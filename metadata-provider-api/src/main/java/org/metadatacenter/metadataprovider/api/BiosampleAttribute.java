package org.metadatacenter.metadataprovider.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonPropertyOrder({"attributeName", "attributeValue", "attributeNameTermUri", "attributeNameTermLabel",
    "attributeNameTermAltLabels", "attributeNameTermSource", "attributeValueTermUri", "attributeValueTermLabel",
    "attributeValueTermAltLabels", "attributeValueTermSource"})
public class BiosampleAttribute {

  // Properties shared by original and annotated samples
  private String attributeName;
  private String attributeValue;

  // Properties for annotated samples
  private String attributeNameTermUri;
  private String attributeNameTermLabel;
  private List<String> attributeNameTermAltLabels;
  private String attributeNameTermSource;

  private String attributeValueTermUri;
  private String attributeValueTermLabel;
  private List<String> attributeValueTermAltLabels;
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