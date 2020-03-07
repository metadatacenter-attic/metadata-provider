package org.metadatacenter.metadataprovider.api;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(value = {"pis"})
public class Bioproject {

  private String bioprojectAccession;
  private String projectName;
  private String projectTitle;
  private List<Organization> organizations;

  public Bioproject() {
  }

  public String getBioprojectAccession() {
    return bioprojectAccession;
  }

  public String getProjectName() {
    return projectName;
  }

  public String getProjectTitle() {
    return projectTitle;
  }

  public List<Organization> getOrganizations() {
    return organizations;
  }
}
