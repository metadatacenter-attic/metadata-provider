import React, {useState} from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import SearchComponent from './components/SearchComponent';
import Col from "react-bootstrap/Col";
import {Form} from "react-bootstrap";
import {SAMPLE_QUERIES} from "./constants";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

export default function App() {

  const [queryIndex, setQueryIndex] = useState();
  const [originalSampleIDsFound, setOriginalSampleIDsFound] = useState([]);
  const [originalProjectIDsFound, setOriginalProjectIDsFound] = useState([]);
  const sampleQueries = SAMPLE_QUERIES;

  function getSampleQueries(index, db) {
    if (index) {
      if (db === 'original') {
        return sampleQueries[index].queriesOriginalDB;
      } else {
        return sampleQueries[index].queriesAnnotatedDB;
      }
    } else {
      return null;
    }
  };

  function getRelevantAttributes(index) {
    if (index && sampleQueries[index]) {
      return sampleQueries[index].relevantAttributes;
    } else {
      return [];
    }
  };

  function saveOriginalSampleIDsFound(ids) {
    setOriginalSampleIDsFound(ids);
  };

  function saveOriginalProjectIDsFound(ids) {
    setOriginalProjectIDsFound(ids);
  };

  return (
    <div className="App">

      <div className="App-header">
        <h1>Metadata Provider<sup><i>prototype</i></sup></h1>
      </div>

      <div className="App-content">

        <div className="instructions-container">
          <p><span
            className="database">Database: NCBI BioSample Extract </span><span>(4,346 samples from Homo sapiens)</span>
          </p>
          {/*<p className="label">Enter a search query or load an example:</p>*/}
          <Container>
            <Row className="example-selection">
              <Col></Col>
              <Col md={6}>
                <Form.Group controlId="exampleSelectionForm">
                  <InputGroup>
                    <Form.Control value={queryIndex} as="select" onChange={e => setQueryIndex(e.target.value)}>
                      {!queryIndex && <option>Load a sample query ...</option>}
                      {sampleQueries.map((item, index) => (
                        <option key={index} value={index}>Example {index + 1} ({item.researchQuestionShort})</option>
                      ))}
                    </Form.Control>
                    {queryIndex && queryIndex !== "" &&
                    <InputGroup.Append>
                      <Button type={"reset"} className="btn-clear" onClick={e => setQueryIndex("")}>
                        <FontAwesomeIcon icon={faTimes}/></Button>
                    </InputGroup.Append>}
                  </InputGroup>

                </Form.Group>
              </Col>
              <Col></Col>
            </Row>
          </Container>
          {queryIndex &&
          <div className="goal">
            <p variant={"info"}><i dangerouslySetInnerHTML={{__html: sampleQueries[queryIndex].researchQuestion}}/></p>
          </div>}
        </div>

        <div className="search-container">
          <Container fluid>
            <Row>
              <Col md={6} className="search-container-col">
                <SearchComponent title="Original BioSample Metadata"
                                 db="original"
                                 relevantAttributes={getRelevantAttributes(queryIndex)}
                  /* We use the key prop to tell React that the component identity has changed,
                    forcing a full re-instantiation of that component */
                                 key={queryIndex}
                                 sampleQueries={getSampleQueries(queryIndex, 'original')}
                                 saveSampleIDs={saveOriginalSampleIDsFound}
                                 saveProjectIDs={saveOriginalProjectIDsFound}
                                 originalSampleIDs={originalSampleIDsFound}
                                 originalProjectIDs={originalProjectIDsFound}
                />
              </Col>
              <Col md={6} className="search-container-col">
                <SearchComponent title="Processed Metadata"
                                 db="annotated"
                                 relevantAttributes={getRelevantAttributes(queryIndex)}
                                 key={queryIndex}
                                 sampleQueries={getSampleQueries(queryIndex, 'annotated')}
                                 originalSampleIDs={originalSampleIDsFound}
                                 originalProjectIDs={originalProjectIDsFound}
                />
              </Col>
            </Row>
          </Container>
        </div>

      </div>

      <div className="App-footer">
        <div className="d-flex flex-column">
          <footer className="footer">
            <div>
              <a href="https://bmir.stanford.edu/">Stanford Center for Biomedical Informatics Research (BMIR)</a>

            </div>
            <div className="ml-auto">
              <span>&copy; 2020 </span>
              The Board of Trustees of Leland Stanford Junior University
            </div>
          </footer>
        </div>
      </div>

    </div>
  );
}
