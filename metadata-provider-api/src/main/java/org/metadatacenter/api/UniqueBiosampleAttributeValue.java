package org.metadatacenter.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UniqueBiosampleAttributeValue implements Comparable<UniqueBiosampleAttributeValue> {

  @JsonProperty("attributeValue")
  private String attributeValue;
  @JsonProperty("attributeValueTermUri")
  private String attributeValueTermUri;
  @JsonProperty("attributeValueTermLabel")
  private String attributeValueTermLabel;
  @JsonProperty("attributeValueTermSource")
  private String attributeValueTermSource;
  @JsonProperty("count")
  private int count;

  public UniqueBiosampleAttributeValue() {
    // Jackson deserialization
  }

  // Original value
  public UniqueBiosampleAttributeValue(String attributeValue, int count) {
    this.attributeValue = attributeValue;
    this.count = count;
  }

  // Annotated value
  public UniqueBiosampleAttributeValue(String attributeValueTermUri, String attributeValueTermLabel,
                                       String attributeValueTermSource, int count) {
    this.attributeValueTermUri = attributeValueTermUri;
    this.attributeValueTermLabel = attributeValueTermLabel;
    this.attributeValueTermSource = attributeValueTermSource;
    this.count = count;
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

  public int getCount() {
    return count;
  }

  public void setCount(int count) {
    this.count = count;
  }

  @Override
  public int compareTo(UniqueBiosampleAttributeValue obj) {
    return Integer.compare(this.count, obj.getCount());
  }
}
