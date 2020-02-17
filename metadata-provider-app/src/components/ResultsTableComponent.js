import React from 'react';
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import {faStar} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import SampleDetailsModal from "./SampleDetailsModal";


export default function ResultsTableComponent(props) {

  return (
    <>
      {props.showSamplesOrProjects === 'samples' && props.samples.length > 0 &&
      <Container>
        <Row>
          <Col>
            <Container>
              <div className="results">
                <Table size={'sm'} striped bordered hover variant="dark">
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>Sample ID</th>
                    {props.db === 'annotated' && props.extraSampleIDs.length > 0 &&
                    <th>New</th>
                    }
                  </tr>
                  </thead>
                  <tbody>
                  {props.samples.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <SampleDetailsModal
                          sample={item}
                          relevantAttributes={props.relevantAttributes}
                        />
                      </td>
                      {props.db === 'annotated' && props.extraSampleIDs.length > 0 &&
                      <td>{props.extraSampleIDs.includes(item.biosampleAccession) &&
                      <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>}</td>
                      }
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
      {props.samples.length === 0 && <div><p>No samples found</p></div>}

      {props.showSamplesOrProjects === 'projects' && props.projectIDs.length > 0 &&
      <Container>
        <Row>
          <Col>
            <Container>
              <div className="results">
                <Table size={'sm'} striped bordered hover variant="dark">
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>Project ID</th>
                    {props.db === 'annotated' && props.extraProjectIDs.length > 0 &&
                    <th>New</th>
                    }
                  </tr>
                  </thead>
                  <tbody>
                  {props.projectIDs.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <Button size={'sm'} className="btn-secondary" target='_blank'
                                href={'https://www.ncbi.nlm.nih.gov/bioproject/' + item}>
                          PRJNA{item}
                        </Button>
                      </td>
                      {props.db === 'annotated' && props.extraProjectIDs.length > 0 &&
                      <td>{props.extraProjectIDs.includes(item) &&
                      <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>}</td>
                      }
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
      {props.projectIDs.length === 0 && <div><p className="search-msg">No projects found</p></div>}
    </>
  );

}