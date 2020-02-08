import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import SearchResultsComponent from './components/SearchResultsComponent';

function App() {

  const sampleQueriesOriginal = [
    "disease=liver cancer AND tissue=liver",
    "disease=hepatoma AND tissue=liver",
    "disease=hepatocellular carcinoma AND tissue=liver",
    "disease=hepatocellular carcinoma AND tissue=cancerous liver tissue"
  ];

  const sampleQueriesAnnotated = [
    "NCIT:C2991=NCIT:C7927 AND NCIT:C12801=NCIT:C12392"
  ];

  return (
    <div className="App">

      <div className="App-header">
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

        <h1>Metadata Provider</h1>
        <Container className="mt-4" fluid>
          <Row>
            <SearchResultsComponent title="Original database" sampleQueries={sampleQueriesOriginal} db="original"/>
            <SearchResultsComponent title="Curated database" sampleQueries={sampleQueriesAnnotated} db="annotated"/>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default App;
