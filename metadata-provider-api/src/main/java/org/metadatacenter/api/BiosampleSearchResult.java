package org.metadatacenter.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class BiosampleSearchResult {

  @JsonProperty("biosamples")
  private List<Biosample> biosamples;
  @JsonProperty("biosampleAccessions")
  private List<String> biosampleAccessions;
  @JsonProperty("bioprojects")
  private Map<String, UniqueBioproject> bioprojects;
  @JsonProperty("diseaseValues")
  Map<String, UniqueBiosampleAttributeValue> diseaseValues;
  @JsonProperty("tissueValues")
  Map<String, UniqueBiosampleAttributeValue> tissueValues;
  @JsonProperty("cellTypeValues")
  Map<String, UniqueBiosampleAttributeValue> cellTypeValues;
  @JsonProperty("cellLineValues")
  Map<String, UniqueBiosampleAttributeValue> cellLineValues;
  @JsonProperty("sexValues")
  Map<String, UniqueBiosampleAttributeValue> sexValues;

  public BiosampleSearchResult() { }

  public BiosampleSearchResult(List<Biosample> biosamples) {
    this.biosamples = biosamples;
  }

  public BiosampleSearchResult(List<Biosample> biosamples, List<String> biosampleAccessions,
                               Map<String, UniqueBioproject> bioprojects,
                               Map<String, UniqueBiosampleAttributeValue> diseaseValues,
                               Map<String, UniqueBiosampleAttributeValue> tissueValues,
                               Map<String, UniqueBiosampleAttributeValue> cellTypeValues,
                               Map<String, UniqueBiosampleAttributeValue> cellLineValues,
                               Map<String, UniqueBiosampleAttributeValue> sexValues) {
    this.biosamples = biosamples;
    this.biosampleAccessions = biosampleAccessions;
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
  
}
