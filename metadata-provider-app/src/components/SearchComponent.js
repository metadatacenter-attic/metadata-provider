import React, {useEffect, useState} from 'react';
import {Button, Form} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faSearch} from '@fortawesome/free-solid-svg-icons'


function SearchComponent(props) {

  const [hasError, setErrors] = useState(false);
  const [samples, setSamples] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('disease=liver cancer');
  const [sampleQueries, setSampleQueries] = useState([]);
  const [showEnterQueryMessage, setShowEnterQueryMessage] = useState(false);
  const [showSamplesOrProjects, setShowSamplesOrProjects] = useState('samples');

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
  };

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

  function showContent(e, content) {
    setShowSamplesOrProjects(content);
  }

  return (
    <>
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
                rows="1"
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
        {showResults &&
        <Container>
          <Row>
            <Col>
              <Container>
                <Row>
                  <Col md={2}></Col>
                  <Col md={4} className={showSamplesOrProjects === "samples" ?
                    "results-count results-count-left results-count-selected" : "results-count results-count-left"}>
                    <Container onClick={e => showContent(e,'samples')}>
                      <Row><Col className="title">Samples</Col></Row>
                      <Row><Col className="count-left">{samples.length}</Col></Row>
                    </Container>
                  </Col>
                  <Col md={4} className={showSamplesOrProjects === "projects" ?
                    "results-count results-count-right results-count-selected" : "results-count results-count-right"}>
                    <Container onClick={e => showContent(e,'projects')}>
                      <Row><Col className="title">Projects</Col></Row>
                      <Row><Col className="count-right">{samples.length}</Col></Row>
                    </Container>
                  </Col>
                  <Col md={2}></Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
        }
        {showResults && showSamplesOrProjects === 'samples' &&
        <Container>
          <Row>
            <Col>
              <Container>
                <div className="results">
                  <Table striped bordered hover variant="dark">
                    <thead>
                    <tr>
                      <th>#</th>
                      <th>Sample ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    {samples.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td><a href={item.biosampleUrl}>{item.biosampleAccession}</a></td>
                      </tr>
                    ))}
                    </tbody>
                  </Table>
                </div>
              </Container>

            </Col>
          </Row>
        </Container>
        }
        {showResults && showSamplesOrProjects === 'projects' &&
        <Container>
          <Row>
            <Col>
              <Container>
                <div className="results">
                  <Table striped bordered hover variant="dark">
                    <thead>
                    <tr>
                      <th>#</th>
                      <th>Project ID</th>
                      <th>Title</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/*{samples.map((item, index) => (*/}
                    {/*  <tr key={index}>*/}
                    {/*    <td>{index + 1}</td>*/}
                    {/*    <td><a href={item.biosampleUrl}>{item.biosampleAccession}</a></td>*/}
                    {/*    <td>{item.sampleName ? item.sampleName : 'NA'}</td>*/}
                    {/*    /!*<td>{item.bioprojectAccession}</td>*!/*/}
                    {/*  </tr>*/}
                    {/*))}*/}
                    </tbody>
                  </Table>
                </div>
              </Container>

            </Col>
          </Row>
        </Container>
        }
      </>
    </>
  );

}

export default SearchComponent;