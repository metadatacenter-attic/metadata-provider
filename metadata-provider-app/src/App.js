import React, {useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import SearchResultsComponent from './components/SearchResultsComponent';
import Button from "react-bootstrap/Button";
import ExamplesModalComponent from "./components/ExamplesModalComponent";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import {Form} from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Collapse from "react-bootstrap/Collapse";

//import 'holderjs/holder.js'; // uninstall if not needed

export default function App() {

  const [modalShow, setModalShow] = useState(false);
  const [queryIndex, setQueryIndex] = useState(0);
  const [showExamplesPanel, setShowExamplesPanel] = useState(false);

  const [searchQueryOriginal, setSearchQueryOriginal] = useState('');
  const [searchQueryAnnotated, setSearchQueryAnnotated] = useState('');


  const sampleQueries = [
    {
      "researchQuestion": "Find all studies using liver tissue samples affected by liver cancer",
      "researchQuestionShort": "Liver tissue; Liver cancer",
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
      "queriesOriginalDB": [
        "bla=ble"
      ],
      "queriesAnnotatedDB": [
        "bli=blo"
      ]
    }
  ];

  function setSampleQueryIndex(selectedIndex) {
    setQueryIndex(selectedIndex);
    console.log(queryIndex)
  };

  function updateSearchQuery(e, query, isQueryAnnotatedDB) {
    if (!isQueryAnnotatedDB) {
      setSearchQueryOriginal(query);
    } else {
      setSearchQueryAnnotated(query);
    }
  };

  return (
    <div className="App">

      <div className="App-header">
        <h1>NCATS Metadata Provider<sup><i>alpha</i></sup></h1>
      </div>

      <div className="App-content">

        <div className="instructions-container">
          <span>Enter a search query or
            <Button variant="link" onClick={() => setShowExamplesPanel(!showExamplesPanel)}>load an example</Button>
          </span>
        </div>


        <Collapse in={showExamplesPanel}>
          <div className="examples-container">
            <Button type="button" className="close" aria-label="Close"
                    onClick={() => setShowExamplesPanel(false)}>
              <span aria-hidden="true">&times;</span>
            </Button>
            <Container>
              <Row className="example-selection">
                <Col md={1}></Col>
                <Col md={10}>
                  <Form.Group controlId="exampleSelectionForm">
                    {/*<Form.Label>Select an example</Form.Label>*/}
                    <Form.Control as="select" onChange={e => setSampleQueryIndex(e.target.value)}>
                      {sampleQueries.map((item, index) => (
                        <option key={index} value={index}>Example {index + 1}. {item.researchQuestion}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={1}></Col>
              </Row>
              {/*<Row>*/}
              {/*  <Col>Example: <i>"{sampleQueries[queryIndex].researchQuestion}"</i></Col>*/}
              {/*</Row>*/}
              <Row>
                <Col md={1}></Col>
                <Col md={3} className="queries-selection">
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Control as="select">
                      <option key={0}>Choose a query on the original metadata...</option>
                      {sampleQueries[queryIndex].queriesOriginalDB.map((item, index) => (
                        <option key={index+1}
                                onClick={e => updateSearchQuery(e, item, false)}>Query {index + 1}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={4}></Col>
                <Col md={3} className="queries-selection">
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Control as="select">
                      <option key={0}>Choose a query on the curated metadata...</option>
                      {sampleQueries[queryIndex].queriesAnnotatedDB.map((item, index) => (
                        <option key={index}
                                onClick={e => updateSearchQuery(e, item, true)}>Query {index + 1}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={1}></Col>
              </Row>
            </Container>
          </div>
        </Collapse>


        <div className="results-container">

          <Container fluid>
            <Row>
              <Col className="search-container-col m-3">
                <SearchResultsComponent title="Original BioSample Metadata" searchQuery={searchQueryOriginal}
                                        db="original"/>
              </Col>
              <Col className="search-container-col m-3">
                <SearchResultsComponent title="Curated BioSample Metadata" searchQuery={searchQueryAnnotated}
                                        db="annotated"/>
              </Col>
            </Row>
          </Container>

        </div>
      </div>
    </div>
  );
}
