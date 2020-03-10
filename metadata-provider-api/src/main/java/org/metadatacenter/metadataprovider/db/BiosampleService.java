package org.metadatacenter.metadataprovider.db;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import org.bson.BsonDocument;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.checkerframework.common.aliasing.qual.Unique;
import org.metadatacenter.metadataprovider.api.*;
import org.metadatacenter.metadataprovider.resources.BiosampleResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Sorts.ascending;
import static com.mongodb.client.model.Sorts.orderBy;

public class BiosampleService {

  private static final Logger logger = LoggerFactory.getLogger(BiosampleService.class);

  private final MongoCollection<Document> samplesCollection;
  private final boolean isAnnotatedSamplesCollection;
  private final ObjectMapper mapper = new ObjectMapper();

  private final String SAMPLE_ACCESSION_FIELD = "biosampleAccession";
  final String ATTRIBUTE_NAME_FIELD = "attributeName";
  final String ATTRIBUTE_NAME_TERM_URI_FIELD = "attributeNameTermUri";
  final String ATTRIBUTE_NAME_TERM_LABEL_FIELD = "attributeNameTermLabel";
  final String ATTRIBUTE_NAME_TERM_ALT_LABELS_FIELD = "attributeNameTermAltLabels";
  final String ATTRIBUTE_VALUE_FIELD = "attributeValue";
  final String ATTRIBUTE_VALUE_TERM_URI_FIELD = "attributeValueTermUri";
  final String ATTRIBUTE_VALUE_TERM_LABEL_FIELD = "attributeValueTermLabel";
  final String ATTRIBUTE_VALUE_TERM_ALT_LABELS_FIELD = "attributeValueTermAltLabels";

  public BiosampleService(MongoCollection<Document> samplesCollection, boolean isAnnotatedSamplesCollection) {
    this.samplesCollection = samplesCollection;
    this.isAnnotatedSamplesCollection = isAnnotatedSamplesCollection;
  }

  public Biosample findByAccession(String accession) throws JsonProcessingException {
    Document sampleDocument = samplesCollection.find(eq(SAMPLE_ACCESSION_FIELD, accession)).first();
    if (sampleDocument != null) {
      return mapper.readValue(sampleDocument.toJson(), Biosample.class);
    } else {
      return null;
    }
  }

  public ApiOutput search(Map<String, String> attributesAndValuesFilter, boolean includeAccessions,
                          boolean includeBioprojectDetails, List<BiosampleResource.Aggregation> aggregations,
                          int offset, int limit)
      throws JsonProcessingException {

    final String DISEASE_ATTRIBUTE_NAME = "disease";
    final String TISSUE_ATTRIBUTE_NAME = "tissue";
    final String CELL_TYPE_ATTRIBUTE_NAME = "cell type";
    final String CELL_LINE_ATTRIBUTE_NAME = "cell line";
    final String SEX_ATTRIBUTE_NAME = "sex";

    // Retrieve the requested samples
    ApiOutput output =
        searchSamples(attributesAndValuesFilter, offset, limit, this.isAnnotatedSamplesCollection);

    // For all the samples that match the query, extract unique biosample accessions and unique values
    // for project IDs and attributes
    // TODO: we are making two calls to the DB in total, and this call is especially heavy. Optimize it.
    List<Biosample> allSamples =
        searchSamples(attributesAndValuesFilter, 0, Integer.MAX_VALUE, this.isAnnotatedSamplesCollection).getData();

    List<String> biosampleAccessions = new ArrayList<>();
    Map<String, UniqueBioproject> bioprojectsMap = new HashMap<>();
    List<UniqueOrganization> organizationsList = new ArrayList<>();
    Map<String, UniqueBiosampleAttributeValue> diseaseValues = new HashMap<>();
    Map<String, UniqueBiosampleAttributeValue> tissueValues = new HashMap<>();
    Map<String, UniqueBiosampleAttributeValue> cellTypeValues = new HashMap<>();
    Map<String, UniqueBiosampleAttributeValue> cellLineValues = new HashMap<>();
    Map<String, UniqueBiosampleAttributeValue> sexValues = new HashMap<>();

    // Extract unique values for project IDs and attributes
    for (Biosample sample : allSamples) {

      // Biosample Accessions
      if (includeAccessions) {
        if (!biosampleAccessions.contains(sample.getBiosampleAccession())) {
          biosampleAccessions.add(sample.getBiosampleAccession());
        }
      }

      // Bioprojects
      if (aggregations.contains(BiosampleResource.Aggregation.project)) {
        if (sample.getBioprojectAccession() != null) {
          if (bioprojectsMap.containsKey(sample.getBioprojectAccession())) { // Update count
            UniqueBioproject found = bioprojectsMap.get(sample.getBioprojectAccession());
            found.setCount(found.getCount() + 1);
            bioprojectsMap.replace(sample.getBioprojectAccession(), found);
          } else { // Add new bioproject
            if (sample.getBioproject() != null) {
              bioprojectsMap.put(sample.getBioprojectAccession(),
                  new UniqueBioproject(sample.getBioprojectAccession(), sample.getBioproject().getProjectName(),
                      sample.getBioproject().getProjectTitle(), sample.getBioproject().getOrganizations(), 1));
            } else {
              throw new NullPointerException("Null Bioproject: " + sample.getBioprojectAccession());
            }
          }
        }
      }

      // Organizations
      if (aggregations.contains(BiosampleResource.Aggregation.organization)) {
        if (sample.getBioproject() != null) {
          for (Organization org : sample.getBioproject().getOrganizations()) {
            int index = findOrganizationIndexByName(organizationsList, org.getName());
            if (index > -1) { // found
              UniqueOrganization found = organizationsList.get(index);
              found.setCount(found.getCount() + 1);
              organizationsList.set(index, found);
            } else { // not found
              organizationsList.add(new UniqueOrganization(org.getName(), org.getUrl(), 1));
            }
          }
        }
      }

      if (aggregations.contains(BiosampleResource.Aggregation.disease)) {
        BiosampleAttribute diseaseAttribute = sample.extractAttribute(DISEASE_ATTRIBUTE_NAME);
        addToUniqueAttributeValuesMap(diseaseValues, diseaseAttribute, isAnnotatedSamplesCollection);
      }

      if (aggregations.contains(BiosampleResource.Aggregation.tissue)) {
        BiosampleAttribute tissueAttribute = sample.extractAttribute(TISSUE_ATTRIBUTE_NAME);
        addToUniqueAttributeValuesMap(tissueValues, tissueAttribute, isAnnotatedSamplesCollection);
      }

      if (aggregations.contains(BiosampleResource.Aggregation.cellType)) {
        BiosampleAttribute cellTypeAttribute = sample.extractAttribute(CELL_TYPE_ATTRIBUTE_NAME);
        addToUniqueAttributeValuesMap(cellTypeValues, cellTypeAttribute, isAnnotatedSamplesCollection);
      }

      if (aggregations.contains(BiosampleResource.Aggregation.cellLine)) {
        BiosampleAttribute cellLineAttribute = sample.extractAttribute(CELL_LINE_ATTRIBUTE_NAME);
        addToUniqueAttributeValuesMap(cellLineValues, cellLineAttribute, isAnnotatedSamplesCollection);
      }

      if (aggregations.contains(BiosampleResource.Aggregation.sex)) {
        BiosampleAttribute sexAttribute = sample.extractAttribute(SEX_ATTRIBUTE_NAME);
        addToUniqueAttributeValuesMap(sexValues, sexAttribute, isAnnotatedSamplesCollection);
      }
    }

    output.setBiosampleAccessions(biosampleAccessions);
    output.setBioprojectsAgg(sortBioprojectMap(bioprojectsMap));

    Collections.sort(organizationsList, Collections.reverseOrder());

    output.setOrganizationsAgg(organizationsList);
    AttributeAggregations attAggregations =
        new AttributeAggregations(sortBiosampleAttributeValueMap(diseaseValues),
            sortBiosampleAttributeValueMap(tissueValues),
            sortBiosampleAttributeValueMap(cellTypeValues),
            sortBiosampleAttributeValueMap(cellLineValues),
            sortBiosampleAttributeValueMap(sexValues));
    output.setAttributesAgg(attAggregations);

    // Remove bioproject details at the sample level if they were not requested
    if (!includeBioprojectDetails) {
      for (Biosample sample : output.getData()) {
        sample.setBioproject(null);
      }
    }

    return output;

  }

  private ApiOutput searchSamples(Map<String, String> attributesAndValuesFilter, int offset, int limit,
                                  boolean searchAnnotated) throws JsonProcessingException {

    MongoCursor<Document> iterator;
    int total;

    if (attributesAndValuesFilter == null || attributesAndValuesFilter.size() == 0) { // Find all
      iterator = samplesCollection.find().skip(offset).limit(limit).iterator();
      total = (int) samplesCollection.countDocuments();
    } else { // Filtered search
      Bson searchFilter = buildSearchFilter(attributesAndValuesFilter, searchAnnotated);
      BsonDocument bsonDocument = searchFilter.toBsonDocument(BsonDocument.class,
          MongoClientSettings.getDefaultCodecRegistry());
      logger.info("Search filter: " + bsonDocument.toJson());
      iterator = samplesCollection.find(searchFilter).sort(orderBy(ascending(SAMPLE_ACCESSION_FIELD)))
          .skip(offset).limit(limit).iterator();
      total = (int) samplesCollection.countDocuments(searchFilter);
    }

    final List<Biosample> samples = new ArrayList<>();

    try {
      while (iterator.hasNext()) {
        final Document sampleDoc = iterator.next();
        samples.add(mapper.readValue(sampleDoc.toJson(), Biosample.class));
      }
    } finally {
      iterator.close();
    }
    Pagination pagination = new Pagination(offset, limit, total);
    ApiOutput output = new ApiOutput(pagination, samples);

    return output;
  }

  private Bson buildSearchFilter(Map<String, String> attributesAndValuesFilter, boolean searchAnnotated) {

    List<Bson> attNameValueFilters = new ArrayList<>();

    if (!searchAnnotated) { // original samples
      for (String attributeName : attributesAndValuesFilter.keySet()) {
        String attributeValue = attributesAndValuesFilter.get(attributeName);
        String attributeValueForRegex = "^" + escapeSpecialRegexChars(attributeValue) + "$";
        attNameValueFilters.add(
            elemMatch("attributes",
                and(eq(ATTRIBUTE_NAME_FIELD, attributeName),
                    regex(ATTRIBUTE_VALUE_FIELD, attributeValueForRegex, "i"))));
      }
    } else { // annotated samples

      for (String attributeName : attributesAndValuesFilter.keySet()) {
        String attributeValue = attributesAndValuesFilter.get(attributeName);
        String attributeNameForRegex = "^" + escapeSpecialRegexChars(attributeName) + "$";
        String attributeValueForRegex = "^" + escapeSpecialRegexChars(attributeValue) + "$";
        attNameValueFilters.add(
            elemMatch("attributes",
                and(
                    or(
                        regex(ATTRIBUTE_NAME_FIELD, attributeNameForRegex, "i"),
                        eq(ATTRIBUTE_NAME_TERM_URI_FIELD, attributeName),
                        regex(ATTRIBUTE_NAME_TERM_LABEL_FIELD, attributeNameForRegex, "i"),
                        in(ATTRIBUTE_NAME_TERM_ALT_LABELS_FIELD, attributeName.toLowerCase())),
                    or(
                        regex(ATTRIBUTE_VALUE_FIELD, attributeValueForRegex, "i"),
                        eq(ATTRIBUTE_VALUE_TERM_URI_FIELD, attributeValue),
                        regex(ATTRIBUTE_VALUE_TERM_LABEL_FIELD, attributeValueForRegex, "i"),
                        in(ATTRIBUTE_VALUE_TERM_ALT_LABELS_FIELD, attributeValue.toLowerCase())))));
      }
    }
    return and(attNameValueFilters);
  }

  private String escapeSpecialRegexChars(String str) {
    Pattern SPECIAL_REGEX_CHARS = Pattern.compile("[{}()\\[\\].+*?^$\\\\|]");
    return SPECIAL_REGEX_CHARS.matcher(str).replaceAll("\\\\$0");
  }

  private boolean isValidValue(BiosampleAttribute attribute, boolean isAnnotated) {
    if (isAnnotated) {
      return (attribute.getAttributeValueTermUri() != null ? true : false);
    } else {
      return (attribute.getAttributeValue() != null ? true : false);
    }
  }

  private Map<String, UniqueBiosampleAttributeValue> addToUniqueAttributeValuesMap(
      Map<String, UniqueBiosampleAttributeValue> uniqueAttributeValuesMap,
      BiosampleAttribute attribute, boolean annotated) {

    if (attribute != null && isValidValue(attribute, annotated)) {

      String key;
      if (!annotated) {
        key = attribute.getAttributeValue().toLowerCase();
      } else {
        key = attribute.getAttributeValueTermUri();
      }

      if (uniqueAttributeValuesMap.containsKey(key)) { // update count
        UniqueBiosampleAttributeValue foundValue = uniqueAttributeValuesMap.get(key);
        foundValue.setCount(foundValue.getCount() + 1);
        uniqueAttributeValuesMap.put(key, foundValue);
      } else { // add new value
        UniqueBiosampleAttributeValue uniqueValue;
        if (!annotated) {
          uniqueValue = new UniqueBiosampleAttributeValue(attribute.getAttributeValue(), 1);
        } else {
          uniqueValue = new UniqueBiosampleAttributeValue(attribute.getAttributeValue(),
              attribute.getAttributeValueTermUri(),
              attribute.getAttributeValueTermLabel(), attribute.getAttributeValueTermAltLabels(),
              attribute.getAttributeValueTermSource(), 1);
        }
        uniqueAttributeValuesMap.put(key, uniqueValue);
      }
    }
    return uniqueAttributeValuesMap;
  }

  private LinkedHashMap sortBiosampleAttributeValueMap(Map<String, UniqueBiosampleAttributeValue> map) {

    return map.entrySet().stream()
        .sorted(Collections.reverseOrder(Map.Entry.comparingByValue()))
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
            (oldValue, newValue) -> oldValue, LinkedHashMap::new));
  }

  private LinkedHashMap sortBioprojectMap(Map<String, UniqueBioproject> map) {

    return map.entrySet().stream()
        .sorted(Collections.reverseOrder(Map.Entry.comparingByValue()))
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
            (oldValue, newValue) -> oldValue, LinkedHashMap::new));
  }

  /**
   * Return position in list
   *
   * @param organizations
   * @param name
   * @return
   */
  private int findOrganizationIndexByName(List<UniqueOrganization> organizations, String name) {
    int i = 0;
    for (UniqueOrganization org : organizations) {
      if (org.getName().toLowerCase().equals(name.toLowerCase())) {
        return i;
      }
      i++;
    }
    return -1;
  }

}