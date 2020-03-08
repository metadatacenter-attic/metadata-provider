package org.metadatacenter.metadataprovider.api;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Map;

public class AttributeAggregations {
  Map<String, UniqueBiosampleAttributeValue> disease;
  Map<String, UniqueBiosampleAttributeValue> tissue;
  Map<String, UniqueBiosampleAttributeValue> cellType;
  Map<String, UniqueBiosampleAttributeValue> cellLine;
  Map<String, UniqueBiosampleAttributeValue> sex;

  public AttributeAggregations() {
  }

  public AttributeAggregations(Map<String, UniqueBiosampleAttributeValue> disease, Map<String,
      UniqueBiosampleAttributeValue> tissue, Map<String, UniqueBiosampleAttributeValue> cellType, Map<String,
      UniqueBiosampleAttributeValue> cellLine, Map<String, UniqueBiosampleAttributeValue> sex) {
    this.disease = disease;
    this.tissue = tissue;
    this.cellType = cellType;
    this.cellLine = cellLine;
    this.sex = sex;
  }

  public Map<String, UniqueBiosampleAttributeValue> getDisease() {
    return disease;
  }

  public Map<String, UniqueBiosampleAttributeValue> getTissue() {
    return tissue;
  }

  public Map<String, UniqueBiosampleAttributeValue> getCellType() {
    return cellType;
  }

  public Map<String, UniqueBiosampleAttributeValue> getCellLine() {
    return cellLine;
  }

  public Map<String, UniqueBiosampleAttributeValue> getSex() {
    return sex;
  }
}
