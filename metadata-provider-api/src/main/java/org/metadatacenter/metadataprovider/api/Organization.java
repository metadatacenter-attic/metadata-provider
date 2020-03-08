package org.metadatacenter.metadataprovider.api;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(value = {"role", "type"})
public class Organization {

  private String name;
  private String url;

  public Organization() {
  }

  public String getName() {
    return name;
  }

  public String getUrl() {
    return url;
  }

}
