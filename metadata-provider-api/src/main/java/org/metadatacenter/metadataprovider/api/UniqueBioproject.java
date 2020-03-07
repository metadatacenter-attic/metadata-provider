package org.metadatacenter.metadataprovider.api;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(value = {"bioprojectAccession"})
public class UniqueBioproject implements Comparable<UniqueBioproject> {

  private String bioprojectAccession;
  private String projectName;
  private String projectTitle;
  private List<Organization> organizations;
  private int count;

  // Generated attributes
  private String bioprojectUrl;

  public UniqueBioproject() {
    // Jackson deserialization
  }

  public UniqueBioproject(String bioprojectAccession, String projectName, String projectTitle,
                          List<Organization> organizations, int count) {
    this.bioprojectAccession = bioprojectAccession;
    this.projectName = projectName;
    this.projectTitle = projectTitle;
    this.organizations = organizations;
    this.count = count;
    this.bioprojectUrl = "https://www.ncbi.nlm.nih.gov/bioproject/" + getBioprojectAccession();
  }

  public String getBioprojectAccession() {
    return bioprojectAccession;
  }

  public String getProjectName() { return projectName; }

  public String getProjectTitle() { return projectTitle; }

  public List<Organization> getOrganizations() { return organizations; }

  public String getBioprojectUrl() {
    return bioprojectUrl;
  }

  public int getCount() {
    return count;
  }

  public void setCount(int count) {
    this.count = count;
  }

  @Override
  public int compareTo(UniqueBioproject bioproject) {
    return Integer.compare(this.count, bioproject.getCount());
  }

}