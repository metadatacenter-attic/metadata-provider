import React, {useEffect, useState} from 'react';
import {Button, Form} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";


function SearchResultsComponent(props) {

  const [hasError, setErrors] = useState(false);
  const [samples, setSamples] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sampleQueries, setSampleQueries] = useState([]);
  const [showEnterQueryMessage, setShowEnterQueryMessage] = useState(false);

  function querySamples(e, db) {
    e.preventDefault();
    if (!searchQuery || searchQuery.length === 0) {
      setShowEnterQueryMessage(true);
    } else {
      setShowEnterQueryMessage(false);
      let preparedSearchQuery = searchQuery
      let url = "http://localhost:8080/biosample/search?q=" + preparedSearchQuery + "&db=" + db;

      fetch(url,
        {method: "GET"})
        .then(response => response.json())
        .then(data => {
          setSamples(data)
          setShowResults(true);
        })
        .catch(err => setErrors(err));
    }
  }

  // Similar to componentDidMount and componentDidUpdate
  useEffect(() => {
    if (props.sampleQueries) {
      setSampleQueries(props.sampleQueries);
    } else {
      setSampleQueries([]);
    }
  }, [props.sampleQueries]);

  function updateSearchQuery(e, v) {
    setSearchQuery(v);
  }

  return (
    <>
      <h3 className="mt-4">{props.title}</h3>
      <Form className="mt-4">
        <Form.Group>
          <Container>
            <Row>
              <Col md={1}> <DropdownButton
                className="search-dropdown-btn"
                disabled={sampleQueries.length === 0}
                flip="true"
                title="">
                {sampleQueries.map((item, index) => (
                  <Dropdown.Item key={index}
                                 onClick={e => updateSearchQuery(e, item)}>{item}</Dropdown.Item>
                ))}
              </DropdownButton></Col>
              <Col md={11} className="search-col">
                <Form.Control
                  className="search-field"
                  as="textarea"
                  rows="1"
                  placeholder="Enter your search query"
                  value={searchQuery}
                  onChange={e => {
                    setShowEnterQueryMessage(false);
                    setSearchQuery(e.target.value)
                  }}/>
              </Col>

            </Row>
          </Container>

          <Button className="mt-4" variant="info" size="lg" type="submit" onClick={e => {
            querySamples(e, props.db)
          }}>Search</Button>
        </Form.Group>
      </Form>
      {showResults &&
      <div className="results">

        <p>Number of samples found: {samples.length}</p>

        <Table striped bordered hover variant="dark">
          <thead>
          <tr>
            <th>#</th>
            <th>BioSample ID</th>
            <th>Name</th>
            {/*<th>BioProject ID</th>*/}
          </tr>
          </thead>
          <tbody>
          {samples.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td><a href={item.biosampleUrl}>{item.biosampleAccession}</a></td>
              <td>{item.sampleName ? item.sampleName : 'NA'}</td>
              {/*<td>{item.bioprojectAccession}</td>*/}
            </tr>
          ))}
          </tbody>
        </Table>

      </div>
      }
      {showEnterQueryMessage && <p>Enter a search query</p>}
      {hasError && <p>Search query error</p>}
    </>
  );

}

export default SearchResultsComponent;