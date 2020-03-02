package org.metadatacenter.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class BiosampleSearchResult {

  @JsonProperty("biosamples")
  private List<Biosample> biosamples;
  @JsonProperty("bioprojects")
  private List<UniqueBioproject> bioprojects;

  @JsonProperty("diseaseValues")
  private List<UniqueBiosampleAttributeValue> diseaseValues;
  @JsonProperty("tissueValues")
  private List<UniqueBiosampleAttributeValue> tissueValues;
  @JsonProperty("cellTypeValues")
  private List<UniqueBiosampleAttributeValue> cellTypeValues;
  @JsonProperty("cellLineValues")
  private List<UniqueBiosampleAttributeValue> cellLineValues;
  @JsonProperty("sexValues")
  private List<UniqueBiosampleAttributeValue> sexValues;

  public BiosampleSearchResult() { }

  public BiosampleSearchResult(List<Biosample> biosamples) {
    this.biosamples = biosamples;
  }

  public BiosampleSearchResult(List<Biosample> biosamples, List<UniqueBioproject> bioprojects,
                               List<UniqueBiosampleAttributeValue> diseaseValues,
                               List<UniqueBiosampleAttributeValue> tissueValues,
                               List<UniqueBiosampleAttributeValue> cellTypeValues,
                               List<UniqueBiosampleAttributeValue> cellLineValues, List<UniqueBiosampleAttributeValue> sexValues) {
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

  public List<UniqueBioproject> getBioprojects() {
    return bioprojects;
  }

  public List<UniqueBiosampleAttributeValue> getDiseaseValues() {
    return diseaseValues;
  }

  public List<UniqueBiosampleAttributeValue> getTissueValues() {
    return tissueValues;
  }

  public List<UniqueBiosampleAttributeValue> getCellTypeValues() {
    return cellTypeValues;
  }

  public List<UniqueBiosampleAttributeValue> getCellLineValues() {
    return cellLineValues;
  }

  public List<UniqueBiosampleAttributeValue> getSexValues() {
    return sexValues;
  }

}
