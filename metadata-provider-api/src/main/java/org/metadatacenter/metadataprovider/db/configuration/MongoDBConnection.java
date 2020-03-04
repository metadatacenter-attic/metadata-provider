package org.metadatacenter.metadataprovider.db.configuration;

public class MongoDBConnection {

  private String user;
  private String password;
  private String host;
  private int port;
  private String database;
  private MongoDBCollections collections;

  public MongoDBConnection() {
  }

  public String getUser() {
    return user;
  }

  public String getPassword() {
    return password;
  }

  public String getHost() {
    return host;
  }

  public int getPort() {
    return port;
  }

  public String getDatabase() {
    return database;
  }

  public MongoDBCollections getCollections() {
    return collections;
  }
}