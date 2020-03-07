package org.metadatacenter.metadataprovider.api;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(value = {"role", "type"})
public class UniqueOrganization {

  private String name;
  private String url;
  private int count;

  public UniqueOrganization() {
  }

  public UniqueOrganization(String name, String url, int count) {
    this.name = name;
    this.url = url;
    this.count = count;
  }

  public String getName() {
    return name;
  }

  public String getUrl() {
    return url;
  }

  public int getCount() {
    return count;
  }

  public void setCount(int count) {
    this.count = count;
  }

}
