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
    for (let i=0; i<data.length; i++) {
      let projectID = data[i]['bioprojectAccession'];
      if (projectID && !projectIDs.includes(projectID)) {
        projectIDs.push(projectID);
      }
    }
    return(projectIDs);
  };

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
      if (!searchQuery || searchQuery==='') {
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
    annotatedSamplesIDs, annotatedProjectIDs]);

  function updateSearchQuery(e, v) {
    setSearchQuery(v);
  }

  function showContent(e, content) {
    setShowSamplesOrProjects(content);
  }

  return (
    <>
      {/*{originalSampleIDs.length} <br/>*/}
      {/*{annotatedSamplesIDs.length} <br/>*/}
      {/*{extraSampleIDs.length} <br/>*/}
      <h2 className="mt-4">{props.title}</h2>
      <Form className="mt-4">
        <Form.Group>
          <Container>
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
                }}><FontAwesomeIcon icon={faSearch}/></Button>
              </InputGroup.Append>
            </InputGroup>
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
                  <Col md={2}></Col>
                  <Col md={4} className={showSamplesOrProjects === "samples" ?
                    "results-count results-count-left results-count-selected" : "results-count results-count-left"}>
                    <Container onClick={e => showContent(e, 'samples')}>
                      <Row><Col className="title">Samples</Col></Row>
                      <Row><Col className="count-left">{samples.length}</Col></Row>
                    </Container>
                  </Col>
                  <Col md={4} className={showSamplesOrProjects === "projects" ?
                    "results-count results-count-right results-count-selected" : "results-count results-count-right"}>
                    <Container onClick={e => showContent(e, 'projects')}>
                      <Row><Col className="title">Projects</Col></Row>
                      <Row><Col className="count-right">{projectIDs.length}</Col></Row>
                    </Container>
                  </Col>
                  <Col md={2}></Col>
                </Row>
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