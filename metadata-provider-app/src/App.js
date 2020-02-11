import React, {useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import SearchResultsComponent from './components/SearchResultsComponent';
import Button from "react-bootstrap/Button";
import ExamplesModalComponent from "./components/ExamplesModalComponent";
import Col from "react-bootstrap/Col";

//import 'holderjs/holder.js'; // uninstall if not needed

export default function App() {

  const [modalShow, setModalShow] = useState(false);
  const [queryIndex, setQueryIndex] = useState(0);

  const [searchQueryOriginal, setSearchQueryOriginal] = useState();
  const [searchQueryAnnotated, setSearchQueryAnnotated] = useState();


  const sampleQueries = [
    {
      "researchQuestion": "liver tissue samples affected by liver cancer",
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
      "queriesOriginalDB": [
        "bla=ble"
      ],
      "queriesAnnotatedDB": [
        "bli=blo"
      ]
    },
    {
      "researchQuestion": "This is question 2",
      "queriesOriginalDB": [
        "bla=ble"
      ],
      "queriesAnnotatedDB": [
        "bli=blo"
      ]
    },
    {
      "researchQuestion": "This is question 2",
      "queriesOriginalDB": [
        "bla=ble"
      ],
      "queriesAnnotatedDB": [
        "bli=blo"
      ]
    },
    {
      "researchQuestion": "This is question 2",
      "queriesOriginalDB": [
        "bla=ble"
      ],
      "queriesAnnotatedDB": [
        "bli=blo"
      ]
    },
    {
      "researchQuestion": "This is question 2",
      "queriesOriginalDB": [
        "bla=ble"
      ],
      "queriesAnnotatedDB": [
        "bli=blo"
      ]
    },
    {
      "researchQuestion": "This is question 2",
      "queriesOriginalDB": [
        "bla=ble"
      ],
      "queriesAnnotatedDB": [
        "bli=blo"
      ]
    },
    {
      "researchQuestion": "This is question 2",
      "queriesOriginalDB": [
        "bla=ble"
      ],
      "queriesAnnotatedDB": [
        "bli=blo"
      ]
    },
    {
      "researchQuestion": "This is question 2",
      "queriesOriginalDB": [
        "bla=ble"
      ],
      "queriesAnnotatedDB": [
        "bli=blo"
      ]
    },
    {
      "researchQuestion": "This is question 2",
      "queriesOriginalDB": [
        "bla=ble"
      ],
      "queriesAnnotatedDB": [
        "bli=blo"
      ]
    },
    {
      "researchQuestion": "This is question 2",
      "queriesOriginalDB": [
        "bla=ble"
      ],
      "queriesAnnotatedDB": [
        "bli=blo"
      ]
    },
    {
      "researchQuestion": "This is question 2",
      "queriesOriginalDB": [
        "bla=ble"
      ],
      "queriesAnnotatedDB": [
        "bli=blo"
      ]
    }
  ];

  function setSampleQueryIndex(index) {
    setQueryIndex(index);
  }

  function updateSearchQuery(e, query, isQueryAnnotatedDB) {
    console.log('Search query ' + query);
    if (!isQueryAnnotatedDB) {
      setSearchQueryOriginal(query);
    }
    else {
      setSearchQueryAnnotated(query);
    }
  }

  return (
    <div className="App">

      <div className="App-header">
        <h1>Metadata Provider</h1>
      </div>

      <div className="App-content">

        {/*<Jumbotron>*/}
        {/*  <h1>Hello, world!</h1>*/}
        {/*  <p>*/}
        {/*    This is a simple hero unit, a simple jumbotron-style component for calling*/}
        {/*    extra attention to featured content or information.*/}
        {/*  </p>*/}
        {/*  <p>*/}
        {/*    <Button variant="primary">Learn more</Button>*/}
        {/*  </p>*/}
        {/*</Jumbotron>*/}

        <p>Enter a search query or
          <Button variant="primary" onClick={() => setModalShow(true)}>
            Select an example
          </Button></p>

        <ExamplesModalComponent
          show={modalShow}
          onHide={() => setModalShow(false)}
          sampleQueries={sampleQueries}
          setSampleQueryIndex={setSampleQueryIndex}
        />

        {/*Examples container*/}
        {queryIndex != null && <Container className="examples-container mt-4" fluid>
          <Row>
            <Col className="m-3"><i>"Find all studies using {sampleQueries[queryIndex].researchQuestion}"</i></Col>
          </Row>
          <Row>
            <Col><h5>Examples:</h5>
              <ul>
                {sampleQueries[queryIndex].queriesOriginalDB.map((item, index) => (
                  <li key={index}
                      onClick={e => updateSearchQuery(e, item, false)}>{item}</li>
                ))}
              </ul>
            </Col>
            <Col><h5>Examples:</h5>
              <ul>
                {sampleQueries[queryIndex].queriesAnnotatedDB.map((item, index) => (
                  <li key={index}
                      onClick={e => updateSearchQuery(e, item, true)}>{item}</li>
                ))}
              </ul>
            </Col>
          </Row>
        </Container>}

        {/*Results container*/}
        <Container className="mt-4" fluid>
          <Row>
            <SearchResultsComponent title="Original BioSample" searchQuery={searchQueryOriginal} db="original"/>
            <SearchResultsComponent title="Curated BioSample" searchQuery={searchQueryAnnotated} db="annotated"/>
          </Row>
        </Container>
      </div>
    </div>
  );
}
