import React, {useState} from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import SearchComponent from './components/SearchComponent';
import Col from "react-bootstrap/Col";
import {Form} from "react-bootstrap";

//import 'holderjs/holder.js'; // uninstall if not needed

export default function App() {

  const [queryIndex, setQueryIndex] = useState();
  const [originalSampleIDsFound, setOriginalSampleIDsFound] = useState([]);
  const [originalProjectIDsFound, setOriginalProjectIDsFound] = useState([]);

  const sampleQueries = [
    {
      "researchQuestion": "I need to find information about <u>biological samples</u> from <u>liver tissue</u> affected by <u>liver cancer</u>.",
      "researchQuestionShort": "liver cancer",
      "relevantAttributes": ["disease", "tissue"],
      "queriesOriginalDB": [
        "disease=liver cancer AND tissue=liver",
        "disease=hepatoma AND tissue=liver",
        "disease=hepatocellular carcinoma AND tissue=liver",
        "disease=hepatocellular carcinoma AND tissue=cancerous liver tissue"
      ],
      "queriesAnnotatedDB": [
        "NCIT:C2991=NCIT:C7927 AND NCIT:C12801=NCIT:C12392"
      ]
    },
    {
      "researchQuestion": "This is question 2",
      "researchQuestionShort": "This is question 2",
      "relevantAttributes": ["disease", "tissue"],
      "queriesOriginalDB": [
        "bla=ble"
      ],
      "queriesAnnotatedDB": [
        "bli=blo"
      ]
    },
    {
      "researchQuestion": "This is question 2",
      "researchQuestionShort": "This is question 2",
      "relevantAttributes": ["disease", "tissue"],
      "queriesOriginalDB": [
        "bla=ble"
      ],
      "queriesAnnotatedDB": [
        "bli=blo"
      ]
    }
  ];

  function setSampleQueryIndex(selectedIndex) {
    if (selectedIndex) {
      setQueryIndex(selectedIndex);
    } else { // when there is no example selected
      setQueryIndex(null);
    }

  };

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
      return null;
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
        <h1>NCATS Translator - Metadata Provider<sup><i>alpha</i></sup></h1>
      </div>

      <div className="App-content">

        <div className="instructions-container">
          <p className="database">Database: NCBI BioSample</p>
          {/*<p className="label">Enter a search query or load an example:</p>*/}
          <Container>
            <Row className="example-selection">
              <Col></Col>
              <Col md={5}>
                <Form.Group controlId="exampleSelectionForm">
                  <Form.Control as="select" onChange={e => setSampleQueryIndex(e.target.value)} defaultValue="bla">
                    {!queryIndex && <option>Select an example...</option>}
                    {sampleQueries.map((item, index) => (
                      <option key={index} value={index}>Example {index + 1} ({item.researchQuestionShort})</option>
                    ))}s
                  </Form.Control>
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
                <SearchComponent title="Original Metadata"
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
                <SearchComponent title="Cleaned-Up Metadata"
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
    </div>
  );
}
