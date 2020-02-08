import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import SearchResultsComponent from './components/SearchResultsComponent';
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";

//import 'holderjs/holder.js'; // uninstall if not needed


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

        <p>Start with an example</p>

        <Accordion defaultActiveKey="0">
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Start with an example
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>Hello! I'm the body</Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>

        <Form>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Container className="mt-4" fluid>
              <Row>
                <Col>
                  <Form.Label>Tissue</Form.Label>
                  <Form.Control as="select">
                    <option>liver</option>
                    <option>blood</option>
                  </Form.Control>
                </Col>
                <Col>
                  <Form.Label>Disease</Form.Label>
                  <Form.Control as="select">
                    <option>liver</option>
                    <option>blood</option>
                  </Form.Control>
                </Col>
                <Col>
                  <Form.Label>Sex</Form.Label>
                  <Form.Control as="select">
                    <option>liver</option>
                    <option>blood</option>
                  </Form.Control>
                </Col>
                <Col>
                  <Form.Label>Cell line</Form.Label>
                  <Form.Control as="select">
                    <option>liver</option>
                    <option>blood</option>
                  </Form.Control>
                </Col>
                <Col>
                  <Form.Label>Cell type</Form.Label>
                  <Form.Control as="select">
                    <option>liver</option>
                    <option>blood</option>
                  </Form.Control>
                </Col>
              </Row>
            </Container>


          </Form.Group>
        </Form>

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
