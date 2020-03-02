import React, {useState} from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import SearchComponent from './components/SearchComponent';
import Col from "react-bootstrap/Col";
import {Form} from "react-bootstrap";

//import 'holderjs/holder.js'; // uninstall if not needed

export default function App() {

  const [queryIndex, setQueryIndex] = useState();
  const [originalSampleIDsFound, setOriginalSampleIDsFound] = useState([]);
  const [originalProjectIDsFound, setOriginalProjectIDsFound] = useState([]);

  const sampleQueries = [
    {
      "researchQuestion": "I need to find information about <u>biological samples</u> in the setting of <u>myelodysplasia</u>.",
      "researchQuestionShort": "Myelodysplasia",
      "relevantAttributes": ["disease"],
      "queriesOriginalDB": [
        "disease=myelodysplasia",
        "disease=myelodysplastic syndrome",
        "disease=myelodysplastic syndrome (mds)",
        "disease=myelodysplastic syndromes",
        "disease=mds"
      ],
      "queriesAnnotatedDB": [
        "biolink:Disease=mondo:0018881"
      ]
    },
    {
      "researchQuestion": "I need to find information about <u>hepatocellular carcinoma</u> samples from the <u>HepaRG cell line</u>.",
      "researchQuestionShort": "Hepatocellular carcinoma, HepaRG cell line",
      "relevantAttributes": ["disease", "cell line"],
      "queriesOriginalDB": [
        "disease=hepatocellular carcinoma AND cell line=HepaRG",
        "disease=hcc AND cell line=HepaRG",
        "disease=hepatoma AND cell line=HepaRG"
      ],
      "queriesAnnotatedDB": [
        "biolink:Disease=mondo:0007256 AND biolink:CellLine=efo:0001186"
      ]
    },
    {
      "researchQuestion": "I need to find information about <u>biological samples</u> in the setting of <u>systemic lupus erythematosus</u>.",
      "researchQuestionShort": "Systemic lupus erythematosus",
      "relevantAttributes": ["disease"],
      "queriesOriginalDB": [
        "disease=systemic lupus erythematosus",
        "disease=sle",
        "disease=systemic lupus erythematosus (SLE)"
      ],
      "queriesAnnotatedDB": [
        "biolink:Disease=mondo:0007915"
      ]
    }
  ];

  function setSampleQueryIndex(selectedIndex) {
    if (selectedIndex) {
      setQueryIndex(selectedIndex);
    } else { // when there is no example selected
      setQueryIndex(null);
    }

  };

  function getSampleQueries(index, db) {
    if (index) {
      if (db === 'original') {
        return sampleQueries[index].queriesOriginalDB;
      } else {
        return sampleQueries[index].queriesAnnotatedDB;
      }
    } else {
      return null;
    }
  };

  function getRelevantAttributes(index) {
    if (index && sampleQueries[index]) {
      return sampleQueries[index].relevantAttributes;
    } else {
      return [];
    }
  };

  function saveOriginalSampleIDsFound(ids) {
    setOriginalSampleIDsFound(ids);
  };

  function saveOriginalProjectIDsFound(ids) {
    setOriginalProjectIDsFound(ids);
  };

  return (
    <div className="App">

      <div className="App-header">
        <h1>NCATS Translator - Metadata Provider<sup><i>alpha</i></sup></h1>
      </div>

      <div className="App-content">

        <div className="instructions-container">
          <p><span className="database">Database: NCBI BioSample </span><span>(4,346 samples from Homo sapiens)</span></p>
          {/*<p className="label">Enter a search query or load an example:</p>*/}
          <Container>
            <Row className="example-selection">
              <Col></Col>
              <Col md={5}>
                <Form.Group controlId="exampleSelectionForm">
                  <Form.Control as="select" onChange={e => setSampleQueryIndex(e.target.value)}>
                    {!queryIndex && <option>Load an example...</option>}
                    {sampleQueries.map((item, index) => (
                      <option key={index} value={index}>Example {index + 1} ({item.researchQuestionShort})</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col></Col>
            </Row>
          </Container>
          {queryIndex &&
          <div className="goal">
            <p variant={"info"}><i dangerouslySetInnerHTML={{__html: sampleQueries[queryIndex].researchQuestion}}/></p>
          </div>}
        </div>

        <div className="search-container">
          <Container fluid>
            <Row>
              <Col md={6} className="search-container-col">
                <SearchComponent title="Original Metadata"
                                 db="original"
                                 relevantAttributes={getRelevantAttributes(queryIndex)}
                  /* We use the key prop to tell React that the component identity has changed,
                    forcing a full re-instantiation of that component */
                                 key={queryIndex}
                                 sampleQueries={getSampleQueries(queryIndex, 'original')}
                                 saveSampleIDs={saveOriginalSampleIDsFound}
                                 saveProjectIDs={saveOriginalProjectIDsFound}
                                 originalSampleIDs={originalSampleIDsFound}
                                 originalProjectIDs={originalProjectIDsFound}
                />
              </Col>
              <Col md={6} className="search-container-col">
                <SearchComponent title="Cleaned-Up Metadata"
                                 db="annotated"
                                 relevantAttributes={getRelevantAttributes(queryIndex)}
                                 key={queryIndex}
                                 sampleQueries={getSampleQueries(queryIndex, 'annotated')}
                                 originalSampleIDs={originalSampleIDsFound}
                                 originalProjectIDs={originalProjectIDsFound}
                />
              </Col>
            </Row>
          </Container>
        </div>

      </div>
    </div>
  );
}
