package org.metadatacenter.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class BiosampleSearchResult {

  @JsonProperty("biosamples")
  private List<Biosample> biosamples;
  @JsonProperty("bioprojects")
  private List<Bioproject> bioprojects;

  @JsonProperty("diseaseValues")
  private List<BiosampleAttributeValue> diseaseValues;
  @JsonProperty("tissueValues")
  private List<BiosampleAttributeValue> tissueValues;
  @JsonProperty("cellTypeValues")
  private List<BiosampleAttributeValue> cellTypeValues;
  @JsonProperty("cellLineValues")
  private List<BiosampleAttributeValue> cellLineValues;
  @JsonProperty("sexValues")
  private List<BiosampleAttributeValue> sexValues;

  public BiosampleSearchResult() { }

  public BiosampleSearchResult(List<Biosample> biosamples) {
    this.biosamples = biosamples;
  }

  public BiosampleSearchResult(List<Biosample> biosamples, List<Bioproject> bioprojects,
                               List<BiosampleAttributeValue> diseaseValues,
                               List<BiosampleAttributeValue> tissueValues,
                               List<BiosampleAttributeValue> cellTypeValues,
                               List<BiosampleAttributeValue> cellLineValues, List<BiosampleAttributeValue> sexValues) {
    this.biosamples = biosamples;
    this.bioprojects = bioprojects;
    this.diseaseValues = diseaseValues;
    this.tissueValues = tissueValues;
    this.cellTypeValues = cellTypeValues;
    this.cellLineValues = cellLineValues;
    this.sexValues = sexValues;
  }

  public List<Biosample> getBiosamples() {
    return biosamples;
  }

  public List<Bioproject> getBioprojects() {
    return bioprojects;
  }

  public List<BiosampleAttributeValue> getDiseaseValues() {
    return diseaseValues;
  }

  public List<BiosampleAttributeValue> getTissueValues() {
    return tissueValues;
  }

  public List<BiosampleAttributeValue> getCellTypeValues() {
    return cellTypeValues;
  }

  public List<BiosampleAttributeValue> getCellLineValues() {
    return cellLineValues;
  }

  public List<BiosampleAttributeValue> getSexValues() {
    return sexValues;
  }

}
