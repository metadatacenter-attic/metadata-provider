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
  const [projectIDs, setProjectIDs] = useState([]);
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

  function querySamples(e, db) {
    e.preventDefault();
    if (!searchQuery || searchQuery.length === 0) {
      setShowEnterQueryMessage(true);
    } else {
      setLoading(true);
      setShowEnterQueryMessage(false);
      let preparedSearchQuery = searchQuery
      let url = "http://localhost:8080/biosample/search?q=" + preparedSearchQuery + "&db=" + db;

      fetch(url,
        {method: "GET"})
        .then(response => response.json())
        .then(data => {
          setLoading(false);
          setSamples(data);
          setShowResults(true);
          let sampleIDs = getSampleIDs(data);
          let projectIDs = extractProjectIDs(data);
          //let cellTypes = extractCellTypes(data);
          setProjectIDs(projectIDs);
          if (props.db === 'original') {
            // Pass the IDs to the annotated samples component through the parent to compare them
            props.saveSampleIDs(sampleIDs);
            props.saveProjectIDs(projectIDs);
          } else if (props.db === 'annotated') {
            setAnnotatedSamplesIDs(sampleIDs);
            setAnnotatedProjectIDs(projectIDs);
            updateExtraSampleIDs(originalSampleIDs, sampleIDs);
            updateExtraProjectIDs(originalProjectIDs, projectIDs);
          }
        })
        .catch(err => setErrors(err));
    }
  };

  function extractProjectIDs(data) {
    let projectIDs = [];
    for (let i = 0; i < data.length; i++) {
      let projectID = data[i]['bioprojectAccession'];
      if (projectID && !projectIDs.includes(projectID)) {
        projectIDs.push(projectID);
      }
    }
    return (projectIDs);
  };

  // function extractCellTypes(data) {
  //   let cellTypes = [];
  //   for (let i = 0; i < data.length; i++) {
  //     for (let j = 0; j < data[i].attributes.length; j++) {
  //       if (data[i].attributes[j].attributeName === 'cell type') {
  //         let cellType = data[i].attributes[j].attributeValue;
  //         if (cellType && !cellTypes.includes(cellType)) {
  //           cellTypes.push(cellType);
  //           break;
  //         }
  //       }
  //     }
  //   }
  //   console.log(cellTypes);
  //   return (cellTypes);
  // };

  function getSampleIDs(samples) {
    let IDs = []
    for (let i = 0; i < samples.length; i++) {
      IDs.push(samples[i]['biosampleAccession']);
    }
    return IDs;
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
        throw("Couldn't parse attribute-value pair. Attribute name or attribute value are empty: " + attributeValuePair);
      }
    } else {
      throw("Couldn't parse attribute-value pair. Invalid format: " + attributeValuePair);
    }
  };

  function generateBiosampleSearchUrl(query) {
    if (query) {
      try {
        console.log(query)
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
        console.log(biosampleSearchUrl);
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
                {sampleQueries.length > 0 && props.db === "original" &&
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
            {props.db === "original" && searchQuery &&
            <Row>
              <Col md={12}>
                <div className="biosample-link">
                  <Button size="sm" variant="link" href={generateBiosampleSearchUrl(searchQuery)} target="blank">Search
                    in BioSample's website</Button>
                </div>
              </Col>
            </Row>
            }
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
                      <Row><Col className="count-left">{formatNumber(samples.length)}</Col></Row>
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
                {/*  <Col className="results-count results-count-left">*/}
                {/*    <Container>*/}
                {/*      <Row><Col className="title-secondary">Cell Types</Col></Row>*/}
                {/*      <Row><Col className="count-secondary">7</Col></Row>*/}
                {/*    </Container>*/}
                {/*  </Col>*/}
                {/*  <Col className="results-count results-count-left">*/}
                {/*    <Container>*/}
                {/*      <Row><Col className="title-secondary">Cell Lines</Col></Row>*/}
                {/*      <Row><Col className="count-secondary">12</Col></Row>*/}
                {/*    </Container>*/}
                {/*  </Col>*/}
                {/*  /!*<Col className="results-count results-count-left">*!/*/}
                {/*  /!*  <Container>*!/*/}
                {/*  /!*    <Row><Col className="title-secondary">Sex</Col></Row>*!/*/}
                {/*  /!*    <Row><Col className="count-secondary">M</Col></Row>*!/*/}
                {/*  /!*  </Container>*!/*/}
                {/*  /!*</Col>*!/*/}
                {/*  /!*<Col className="results-count results-count-left">*!/*/}
                {/*  /!*  <Container>*!/*/}
                {/*  /!*    <Row><Col className="title-secondary">Age</Col></Row>*!/*/}
                {/*  /!*    <Row><Col className="count-secondary">56.4</Col></Row>*!/*/}
                {/*  /!*  </Container>*!/*/}
                {/*  /!*</Col>*!/*/}
                {/*  <Col className="results-count results-count-left">*/}
                {/*    <Container>*/}
                {/*      <Row><Col className="title-secondary">Centers</Col></Row>*/}
                {/*      <Row><Col className="count-secondary">4</Col></Row>*/}
                {/*    </Container>*/}
                {/*  </Col>*/}
                {/*  <Col className="results-count results-count-left">*/}
                {/*    <Container>*/}
                {/*      <Row><Col className="title-secondary">Investigators</Col></Row>*/}
                {/*      <Row><Col className="count-secondary">5</Col></Row>*/}
                {/*    </Container>*/}
                {/*  </Col>*/}
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
          relevantAttributes={props.relevantAttributes}
        />
        }
      </>
    </>
  );

}

export default SearchComponent;