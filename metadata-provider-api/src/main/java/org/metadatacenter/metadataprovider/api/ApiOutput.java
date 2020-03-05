package org.metadatacenter.metadataprovider.api;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ApiOutput {

  private Pagination pagination;
  private List<Biosample> data;
  private List<String> biosampleAccessions;
  private Map<String, UniqueBioproject> bioprojectsAgg;
  private AttributeAggregations attributesAgg;

  public ApiOutput() {
    // Jackson deserialization
  }

  public ApiOutput(Pagination pagination, List<Biosample> data) {
    this.pagination = pagination;
    this.data = data;
  }

  public Pagination getPagination() {
    return pagination;
  }

  public List<Biosample> getData() {
    return data;
  }

  public List<String> getBiosampleAccessions() {
    return biosampleAccessions;
  }

  public Map<String, UniqueBioproject> getBioprojectsAgg() {
    return bioprojectsAgg;
  }

  public AttributeAggregations getAttributesAgg() {
    return attributesAgg;
  }

  public void setBiosampleAccessions(List<String> biosampleAccessions) {
    this.biosampleAccessions = biosampleAccessions;
  }

  public void setBioprojectsAgg(Map<String, UniqueBioproject> bioprojectsAgg) {
    this.bioprojectsAgg = bioprojectsAgg;
  }

  public void setAttributesAgg(AttributeAggregations attributesAgg) {
    this.attributesAgg = attributesAgg;
  }
}
