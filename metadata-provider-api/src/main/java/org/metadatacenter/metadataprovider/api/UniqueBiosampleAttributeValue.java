package org.metadatacenter.metadataprovider.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UniqueBiosampleAttributeValue implements Comparable<UniqueBiosampleAttributeValue> {

  private String attributeValue;
  private String attributeValueTermUri;
  private String attributeValueTermLabel;
  private List<String> attributeValueTermAltLabels;
  private String attributeValueTermSource;
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
  public UniqueBiosampleAttributeValue(String attributeValue,
                                       String attributeValueTermUri, String attributeValueTermLabel,
                                       List<String> attributeValueTermAltLabels,
                                       String attributeValueTermSource, int count) {
    this.attributeValue = attributeValue;
    this.attributeValueTermUri = attributeValueTermUri;
    this.attributeValueTermLabel = attributeValueTermLabel;
    this.attributeValueTermAltLabels = attributeValueTermAltLabels;
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

  public List<String> getAttributeValueTermAltLabels() { return attributeValueTermAltLabels; }

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
