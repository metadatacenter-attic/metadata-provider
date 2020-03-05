package org.metadatacenter.metadataprovider.api;

public class Pagination {

  private int offset;
  private int limit;
  private int total;

  public Pagination() {
  }

  public Pagination(int offset, int limit, int total) {
    this.offset = offset;
    this.limit = limit;
    this.total = total;
  }

  public int getOffset() {
    return offset;
  }

  public int getLimit() {
    return limit;
  }

  public int getTotal() {
    return total;
  }
}
