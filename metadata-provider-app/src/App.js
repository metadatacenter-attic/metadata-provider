import React, {useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Form} from 'react-bootstrap';
import Table from "react-bootstrap/Table";


function App() {

    const [hasError, setErrors] = useState(false);
    const [samples, setSamples] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showEnterQueryMessage, setShowEnterQueryMessage] = useState(false);

    const sampleQueriesOriginal = [
        "disease=liver cancer AND tissue=liver",
        "disease=hepatoma AND tissue=liver",
        "disease=hepatocellular carcinoma AND tissue=liver",
        "disease=hepatocellular carcinoma AND tissue=cancerous liver tissue"
    ];

  const sampleQueriesAnnotated = [
    "NCIT:C2991=NCIT:C7927 AND NCIT:C12801=NCIT:C12392"
  ];



    function queryOriginalSamples(e) {
        e.preventDefault();
        fetchData("original")
    }

    function queryAnnotatedSamples(e) {
        e.preventDefault();
        fetchData("annotated")
    }

    function fetchData(db) {
        if (searchQuery.length === 0) {
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

    function updateSearchQuery(e, v) {
      setSearchQuery(v);
    }

    return (
        <div className="App">
            <div className="App-content">
                <h1>Metadata Provider</h1>
                <Form className="mt-4">
                    <Form.Group controlId="formSearch">
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
                        <div className="examples">
                          <h5>Examples:</h5>
                          <h6>Original samples</h6>
                          <ul>
                          {sampleQueriesOriginal.map((item, index) => (
                              <li key={index} onClick={e => updateSearchQuery(e, sampleQueriesOriginal[index])}>{item}</li>
                          ))}
                          </ul>

                          <h6>Curated samples</h6>
                          <ul>
                            {sampleQueriesAnnotated.map((item, index) => (
                                <li key={index} onClick={e => updateSearchQuery(e, sampleQueriesAnnotated[index])}>{item}</li>
                            ))}
                          </ul>
                        </div>
                    </Form.Group>

                    <Button id="original-button" variant="info" type="submit"
                            onClick={e => {
                                queryOriginalSamples(e)
                            }}>
                        Search samples
                    </Button>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <Button id="annotated-button" variant="info" type="submit"
                            onClick={e => {
                                queryAnnotatedSamples(e)
                            }}>
                        Search curated samples
                    </Button>
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
                            <tr>
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

            </div>
        </div>
    );
}

export default App;
