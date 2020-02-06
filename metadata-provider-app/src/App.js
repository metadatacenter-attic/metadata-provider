import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Form} from 'react-bootstrap';
import {useState} from "react";


function App() {

    const [hasError, setErrors] = useState(false);
    const [samples, setSamples] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showEnterQueryMessage, setShowEnterQueryMessage] = useState(false);
    
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

    return (
        <div className="App">
            <div className="App-content">
                <h2>Metadata Provider</h2>
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
                        <Form.Text className="text-muted">
                            Examples: <br/>disease=liver cancer AND tissue=liver <br/>
                            NCIT:C2991=NCIT:C7927 AND NCIT:C12801=NCIT:C12392
                        </Form.Text>
                    </Form.Group>

                    <Button id="original-button" variant="primary" type="submit"
                            onClick={e => {
                              queryOriginalSamples(e)
                            }}>
                        Search samples
                    </Button>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <Button id="annotated-button" variant="primary" type="submit"
                            onClick={e => {
                              queryAnnotatedSamples(e)
                            }}>
                        Search curated samples
                    </Button>
                </Form>
                {showResults &&
                <div className="results">
                    <p>Number of samples found: {samples.length}</p>
                    <ol>
                        {samples.map(item => (
                            <li key={item.biosampleAccession}>
                                <a href={item.biosampleUrl}>{item.biosampleAccession}</a>
                            </li>
                        ))}
                    </ol>
                </div>
                }
                {showEnterQueryMessage && <p>Enter a search query</p>}
                {hasError && <p>Search query error</p>}

            </div>
        </div>
    );
}

export default App;
