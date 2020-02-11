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

          {/*<Accordion defaultActiveKey="1">Enter a search query or*/}
          {/*  <Accordion.Toggle as={Button} variant="link" eventKey="0">*/}
          {/*    load an example*/}
          {/*  </Accordion.Toggle>*/}
          {/*  <Accordion.Collapse eventKey="0">*/}
          {/*    <Form.Group className="example-selection" controlId="exampleSelectionForm">*/}
          {/*      <Form.Control as="select" onChange={e => setSampleQueryIndex(e.target.value)}>*/}
          {/*        {sampleQueries.map((item, index) => (*/}
          {/*          <option key={index} value={index}>{index + 1}. {item.researchQuestionShort}</option>*/}
          {/*        ))}*/}
          {/*      </Form.Control>*/}
          {/*    </Form.Group>*/}
          {/*  </Accordion.Collapse>*/}
          {/*</Accordion>*/}
        </div>

        {showExamplesPanel &&
        <div className="examples-container">

          <Button type="button" className="close" aria-label="Close" onClick={() => setShowExamplesPanel(false)}>
            <span aria-hidden="true">&times;</span>
          </Button>

          {queryIndex != null &&
          <Container fluid>
            <Row className="example-selection">
              <Col>
                <Form.Group controlId="exampleSelectionForm">
                  <Form.Control as="select" onChange={e => setSampleQueryIndex(e.target.value)}>
                    {sampleQueries.map((item, index) => (
                      <option key={index} value={index}>{index + 1}. {item.researchQuestionShort}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>Example: <i>"{sampleQueries[queryIndex].researchQuestion}"</i></Col>
            </Row>
            <Row>
              <Col className="queries-selection">
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control as="select">
                    {sampleQueries[queryIndex].queriesOriginalDB.map((item, index) => (
                      <option key={index} onClick={e => updateSearchQuery(e, item, false)}>{index + 1}. {item}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col className="queries-selection">
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control as="select">
                    {sampleQueries[queryIndex].queriesAnnotatedDB.map((item, index) => (
                      <option key={index} onClick={e => updateSearchQuery(e, item, true)}>{index + 1}. {item}</option>
                    ))}
                  </Form.Control>
                </Form.Group>

              </Col>
            </Row>
          </Container>}
        </div>
        }

        <Container fluid>
          <Row>
            <SearchResultsComponent title="Original BioSample" searchQuery={searchQueryOriginal} db="original"/>
            <SearchResultsComponent title="Curated BioSample" searchQuery={searchQueryAnnotated} db="annotated"/>
          </Row>
        </Container>
      </div>
    </div>
  );
}
