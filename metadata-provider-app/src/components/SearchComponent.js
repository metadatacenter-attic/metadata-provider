import React, {useEffect, useState} from 'react';
import {Button, Form} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faSearch} from '@fortawesome/free-solid-svg-icons'
import ResultsTableComponent from "./ResultsTableComponent";
import Spinner from "react-bootstrap/Spinner";


function SearchComponent(props) {

  const [hasError, setErrors] = useState(false);
  const [samples, setSamples] = useState([]);
  const [sampleIDs, setSampleIDs] = useState([]);
  const [projectIDs, setProjectIDs] = useState([]);
  const [totalSamplesCount, setTotalSamplesCount] = useState();

  // Maps with unique attribute values
  // const [diseases, setDiseases] = useState({});
  // const [tissues, setTissues] = useState({});
  // const [cellTypes, setCellTypes] = useState({});
  // const [cellLines, setCellLines] = useState({});
  // const [sexs, setSexs] = useState({});

  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState(/*'disease=liver cancer'*/);
  const [sampleQueries, setSampleQueries] = useState([]);
  const [showEnterQueryMessage, setShowEnterQueryMessage] = useState(false);
  const [showSamplesOrProjects, setShowSamplesOrProjects] = useState('samples');

  const [originalSampleIDs, setOriginalSamplesIDs] = useState([]);
  const [annotatedSamplesIDs, setAnnotatedSamplesIDs] = useState([]);
  const [extraSampleIDs, setExtraSampleIDs] = useState([]);

  const [originalProjectIDs, setOriginalProjectIDs] = useState([]);
  const [annotatedProjectIDs, setAnnotatedProjectIDs] = useState([]);
  const [extraProjectIDs, setExtraProjectIDs] = useState([]);

  const [loading, setLoading] = useState(false);

  const [limit, setLimit] = useState(200);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);



  function querySamples(e, db) {
    e.preventDefault();
    if (!searchQuery || searchQuery.length === 0) {
      setShowEnterQueryMessage(true);
    } else {
      setLoading(true);
      setShowEnterQueryMessage(false);
      let preparedSearchQuery = searchQuery;
      let url = "http://localhost:8080/biosample/query?q=" + preparedSearchQuery + "&db=" +
        db + "&include_accessions=true&aggregations=project&offset=0&limit=" + limit;
      //http://localhost:8080/biosample/query?q=disease=mds&db=annotated&include_accessions=true&aggregations=project&aggregations=tissue&offset=0&limit=2
      console.log('first call');
      console.log(url);
      fetch(url,
        {method: "GET"})
        .then(response => response.json())
        .then(data => {
          setLoading(false);
          // Save results
          setSamples(data["data"]);
          let sampleIDs = data["biosampleAccessions"];
          setTotalSamplesCount(sampleIDs.length);
          let projectIDs = Object.keys(data["bioprojectsAgg"]);

          setProjectIDs(projectIDs);
          // setDiseases(data["diseaseValues"]);
          // setTissues(data["tissueValues"]);
          // setCellTypes(data["cellTypeValues"]);
          // setCellLines(data["cellLineValues"]);
          // setSexs(data["sexValues"]);
          setShowResults(true);

          if (props.db === 'original') {
            // Pass the IDs to the annotated samples component through the parent to compare them
            props.saveSampleIDs(sampleIDs);
            props.saveProjectIDs(projectIDs);
          } else if (props.db === 'annotated') {
            setAnnotatedSamplesIDs(data["biosampleAccessions"]);
            setAnnotatedProjectIDs(projectIDs);
            updateExtraSampleIDs(originalSampleIDs, sampleIDs);
            updateExtraProjectIDs(originalProjectIDs, projectIDs);
          }
        })
        .catch(err => setErrors(err));
    }
  };

  function loadMore() {
    console.log("Loading more");
    let offset = currentOffset + limit;
    if (offset <= totalSamplesCount) {
      setCurrentOffset(offset);
      let url = "http://localhost:8080/biosample/query?q=" + searchQuery + "&db=" + props.db + "&include_accessions=true&aggregations=project&offset=" + offset + "&limit=" + limit;
      console.log(url);
      // setTimeout(() => {
        fetch(url,
          {method: "GET"}).then(response => response.json()).then(data => {
          console.log(data);
          setSamples(samples.concat(data["data"]));
        }).catch(err => setErrors(err));
      // }, 1500);
    }
    else {
      setHasMore(false);
    }
  };

  function updateExtraSampleIDs(originalSampleIDs, annotatedSamplesIDs) {
    if (originalSampleIDs.length > 0 && annotatedSamplesIDs.length > 0) {
      let difference = annotatedSamplesIDs.filter(x => !originalSampleIDs.includes(x));
      setExtraSampleIDs(difference);
    } else {
      setExtraSampleIDs([]);
    }
  };

  function updateExtraProjectIDs(originalProjectIDs, annotatedProjectIDs) {
    let difference = annotatedProjectIDs.filter(x => !originalProjectIDs.includes(x));
    setExtraProjectIDs(difference);
  };

  // Similar to componentDidMount and componentDidUpdate
  useEffect(() => {
    if (props.sampleQueries) {
      setSampleQueries(props.sampleQueries);
      if (!searchQuery || searchQuery === '') {
        setSearchQuery(props.sampleQueries[0]); // Pick the first sample query by default
      }
    } else {
      setSampleQueries([]);
    }
    if (props.originalSampleIDs) {
      setOriginalSamplesIDs(props.originalSampleIDs);
      updateExtraSampleIDs(props.originalSampleIDs, annotatedSamplesIDs);
    } else {
      setOriginalSamplesIDs([]);
    }
    if (props.originalProjectIDs) {
      setOriginalProjectIDs(props.originalProjectIDs);
      updateExtraProjectIDs(props.originalProjectIDs, annotatedProjectIDs);
    } else {
      setOriginalSamplesIDs([]);
    }
  }, [props.sampleQueries, props.originalSampleIDs, props.originalProjectIDs,
    annotatedSamplesIDs, annotatedProjectIDs, searchQuery]);

  function updateSearchQuery(e, v) {
    setSearchQuery(v);
    setShowResults(false);
  };

  function showContent(e, content) {
    setShowSamplesOrProjects(content);
  };

  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  };

  /* Extracts the attribute name and value from a string in the form attributeName=attributeValue and returns them in
   an array [attributeName, attributeValue] */
  function parseAttributeValuePair(attributeValuePair) {
    if (attributeValuePair.includes('=')) {
      let splitArray = attributeValuePair.split('=');
      let attributeName = splitArray[0].trim();
      let attributeValue = splitArray[1].trim();
      if (attributeName.length > 0 && attributeValue.length > 0) {
        return [attributeName, attributeValue];
      } else {
        throw Error("Couldn't parse attribute-value pair. Attribute name or attribute value are empty: " + attributeValuePair);
      }
    } else {
      throw Error("Couldn't parse attribute-value pair. Invalid format: " + attributeValuePair);
    }
  };

  function generateBiosampleSearchUrl(query) {
    if (query) {
      try {
        let andRegex = new RegExp('^.* AND .*$', "i");
        let attributeValuePairs = {};
        if (query.match(andRegex)) { // The query contains AND operators
          let queryParts = query.split(new RegExp('AND', "i"));
          queryParts.forEach(item => {
            let attributeNameAndValueArray = parseAttributeValuePair(item);
            attributeValuePairs[attributeNameAndValueArray[0]] = attributeNameAndValueArray[1];
          });
        } else { // The query is just an attribute-value pair
          let attributeNameAndValueArray = parseAttributeValuePair(query);
          attributeValuePairs[attributeNameAndValueArray[0]] = attributeNameAndValueArray[1];
        }
        // Generate search url
        let baseUrl = 'https://www.ncbi.nlm.nih.gov/biosample/?term='
        let biosampleQuery = '';
        let hasOrganismFilter = false;
        for (let attName in attributeValuePairs) {
          let attValue = attributeValuePairs[attName];
          if (attName.toLowerCase() === 'organism') {
            biosampleQuery += attValue + '[Organism]'
            hasOrganismFilter = true;
          } else {
            biosampleQuery += '"' + attName + '=' + attValue + '"[attr]';
          }
          biosampleQuery += ' AND ';
        }
        if (!hasOrganismFilter) {
          biosampleQuery += '"Homo sapiens"[Organism]'
        } else { // remove the last 'AND'
          biosampleQuery = biosampleQuery.substring(0, biosampleQuery.length - 5).trim();
        }
        let biosampleSearchUrl = encodeURI(baseUrl + biosampleQuery);
        return biosampleSearchUrl;
      } catch (err) {
        console.warn(err);
      }
    }
  };

  return (
    <>
      {/*{originalSampleIDs.length} <br/>*/}
      {/*{annotatedSamplesIDs.length} <br/>*/}
      {/*{extraSampleIDs.length} <br/>*/}
      <h2 className="mt-4">{props.title}</h2>
      <Form className="mt-4">
        <Form.Group>
          <Container>
            <Row>
              <InputGroup className="mb-3">
                {sampleQueries.length > 0 &&
                <Dropdown as={InputGroup.Prepend} className="search-dropdown-btn">
                  <Dropdown.Toggle>
                    <FontAwesomeIcon icon={faAngleDown}/>
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    className="search-field-dropdown"
                    flip="true"
                    title="Search">
                    {sampleQueries.map((item, index) => (
                      <Dropdown.Item className="search-field-dropdown item" key={index}
                                     onClick={e => updateSearchQuery(e, item)}>Query {index + 1}. {item}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>}
                <Form.Control
                  id={"searchField-" + props.db}
                  className="search-field"
                  as="textarea"
                  rows="2"
                  placeholder="Enter your search query"
                  value={searchQuery}
                  onChange={e => {
                    setShowEnterQueryMessage(false);
                    setSearchQuery(e.target.value);
                  }}/>

                <InputGroup.Append>
                  <Button className="search-btn" type="submit" onClick={e => {
                    querySamples(e, props.db)
                  }}>
                    <FontAwesomeIcon icon={faSearch}/>
                  </Button>

                  {/*<ButtonGroup>*/}
                  {/*  {sampleQueries.length > 0 && props.db === "original" &&*/}
                  {/*  <DropdownButton title="" as={ButtonGroup} className="search-dropdown-btn">*/}
                  {/*    {sampleQueries.map((item, index) => (*/}
                  {/*      <Dropdown.Item className="search-field-dropdown item" key={index}*/}
                  {/*                     onClick={e => {*/}
                  {/*                       updateSearchQuery(e, item);*/}
                  {/*                     }}>Query {index + 1}. {item}</Dropdown.Item>*/}
                  {/*    ))}*/}
                  {/*  </DropdownButton>}*/}
                  {/*  <Button className="search-btn" type="submit" onClick={e => {*/}
                  {/*    querySamples(e, props.db)*/}
                  {/*  }}>*/}
                  {/*    <FontAwesomeIcon icon={faSearch}/>*/}
                  {/*  </Button>*/}
                  {/*</ButtonGroup>*/}
                </InputGroup.Append>
              </InputGroup>
            </Row>
            <Row>
              <Col md={12}>
                <div className="biosample-link">
                  {props.db === "original" && searchQuery &&
                  <Button size="sm" variant="link" href={generateBiosampleSearchUrl(searchQuery)} target="blank">Search
                    on BioSample's website</Button>
                  }
                  {props.db === "annotated" && searchQuery &&
                  <p>&nbsp;</p>
                  }
                </div>
              </Col>
            </Row>
          </Container>
        </Form.Group>
      </Form>


      {showEnterQueryMessage && <p>Enter a search query</p>}
      {hasError && <p>Search query error</p>}

      <>
        {loading &&
        <Spinner className="spinner" animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
        }
        {!loading && showResults &&
        <Container>
          <Row>
            <Col>
              <Container>
                <Row>
                  {projectIDs.length === 0 && <Col md={4}></Col>}
                  {projectIDs.length > 0 && <Col md={2}></Col>}
                  <Col className={showSamplesOrProjects === "samples" ?
                    "results-count results-count-left results-count-selected" : "results-count results-count-left"}>
                    <Container onClick={e => showContent(e, 'samples')}>
                      <Row><Col className="title">Samples</Col></Row>
                      <Row><Col className="count-left">{formatNumber(totalSamplesCount)}</Col></Row>
                    </Container>
                  </Col>
                  {projectIDs.length > 0 &&
                  <Col className={showSamplesOrProjects === "projects" ?
                    "results-count results-count-right results-count-selected" : "results-count results-count-right"}>
                    <Container onClick={e => showContent(e, 'projects')}>
                      <Row><Col className="title">Projects</Col></Row>
                      <Row><Col className="count-right">{formatNumber(projectIDs.length)}</Col></Row>
                    </Container>
                  </Col>
                  }
                  {projectIDs.length === 0 && <Col md={4}></Col>}
                  {projectIDs.length > 0 && <Col md={2}></Col>}
                </Row>
                {/*<Row>*/}
                {/*  <Col md={1}></Col>*/}
                {/*  {!props.relevantAttributes.includes("disease") &&*/}
                {/*  <Col className="results-count results-count-left">*/}
                {/*    <Container>*/}
                {/*      <Row><Col className="title-secondary">Diseases</Col></Row>*/}
                {/*      <Row><Col className="count-secondary">{formatNumber(Object.keys(diseases).length)}</Col></Row>*/}
                {/*    </Container>*/}
                {/*  </Col>}*/}
                {/*  {!props.relevantAttributes.includes("tissue") &&*/}
                {/*  <Col className="results-count results-count-left">*/}
                {/*    <Container>*/}
                {/*      <Row><Col className="title-secondary">Tissues</Col></Row>*/}
                {/*      <Row><Col className="count-secondary">{formatNumber(Object.keys(tissues).length)}</Col></Row>*/}
                {/*    </Container>*/}
                {/*  </Col>}*/}
                {/*  {!props.relevantAttributes.includes("cell type") &&*/}
                {/*  <Col className="results-count results-count-left">*/}
                {/*    <Container>*/}
                {/*      <Row><Col className="title-secondary">Cell Types</Col></Row>*/}
                {/*      <Row><Col className="count-secondary">{formatNumber(Object.keys(cellTypes).length)}</Col></Row>*/}
                {/*    </Container>*/}
                {/*  </Col>}*/}
                {/*  {!props.relevantAttributes.includes("cell line") &&*/}
                {/*  <Col className="results-count results-count-left">*/}
                {/*    <Container>*/}
                {/*      <Row><Col className="title-secondary">Cell Lines</Col></Row>*/}
                {/*      <Row><Col className="count-secondary">{formatNumber(Object.keys(cellLines).length)}</Col></Row>*/}
                {/*    </Container>*/}
                {/*  </Col>}*/}
                {/*  {!props.relevantAttributes.includes("sex") &&*/}
                {/*  <Col className="results-count results-count-left">*/}
                {/*    <Container>*/}
                {/*      <Row><Col className="title-secondary">Sex</Col></Row>*/}
                {/*      <Row><Col className="count-secondary">{formatNumber(Object.keys(sexs).length)}</Col></Row>*/}
                {/*    </Container>*/}
                {/*  </Col>}*/}
                {/*  {!props.relevantAttributes.includes("investigator") &&*/}
                {/*  <Col className="results-count results-count-left">*/}
                {/*    <Container>*/}
                {/*      <Row><Col className="title-secondary">Investigators</Col></Row>*/}
                {/*      <Row><Col className="count-secondary">5</Col></Row>*/}
                {/*    </Container>*/}
                {/*  </Col>}*/}
                {/*  <Col md={1}></Col>*/}
                {/*</Row>*/}
              </Container>
            </Col>
          </Row>
        </Container>
        }
        {!loading && showResults &&
        <ResultsTableComponent
          showSamplesOrProjects={showSamplesOrProjects}
          db={props.db}
          extraSampleIDs={extraSampleIDs}
          extraProjectIDs={extraProjectIDs}
          samples={samples}
          projectIDs={projectIDs}
          // diseases={diseases}
          // tissues={tissues}
          // cellTypes={cellTypes}
          // cellLines={cellLines}
          // sexs={sexs}
          relevantAttributes={props.relevantAttributes}
          loadMore={loadMore}
          hasMore={hasMore}
        />
        }
      </>
    </>
  );

}

export default SearchComponent;