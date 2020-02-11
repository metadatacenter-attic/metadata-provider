import React, {useEffect, useState} from 'react';
import {Button, Form} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";


function SearchResultsComponent(props) {

  const [hasError, setErrors] = useState(false);
  const [samples, setSamples] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
    setSearchQuery(props.searchQuery);
  }, [props.searchQuery]);

  // function updateSearchQuery(e, v) {
  //   setSearchQuery(v);
  // }

  return (
    <>
      <h3 className="mt-4">{props.title}</h3>
      <Form className="mt-4">
        <Form.Group>
          <Form.Control
            size="lg"
            type="text"
            placeholder="Enter your search query"
            value={searchQuery}
            onChange={e => {
              setShowEnterQueryMessage(false);
              setSearchQuery(e.target.value)
            }}
          />

          <Button className="mt-4" variant="info" size="lg" type="submit" onClick={e => {
            querySamples(e, props.db)
          }}>Search</Button>
          {/*<div className="examples">*/}
          {/*  <h5>Examples:</h5>*/}
          {/*  <ul>*/}
          {/*    {props.sampleQueries.map((item, index) => (*/}
          {/*      <li key={index}*/}
          {/*          onClick={e => updateSearchQuery(e, props.sampleQueries[index])}>{item}</li>*/}
          {/*    ))}*/}
          {/*  </ul>*/}
          {/*</div>*/}
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