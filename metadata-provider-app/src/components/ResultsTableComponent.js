import React from 'react';
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import {faStar} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SampleDetailsModal from "./SampleDetailsModal";
import ProjectDetailsModal from "./ProjectDetailsModal";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'; // Uninstall if not used

export default function ResultsTableComponent(props) {

  // const products = [{
  //   id: 1,
  //   name: "Product1",
  //   price: 120
  // }, {
  //   id: 2,
  //   name: "Product2",
  //   price: 80
  // }];

  return (
    <>
      {/*<Container>*/}
      {/*  <Row>*/}
      {/*    <Col>*/}
      {/*      <Container>*/}
      {/*        <div className="results">*/}
      {/*<BootstrapTable data={products} size={'sm'} striped bordered hover variant="dark">*/}
      {/*  <TableHeaderColumn isKey dataField='id' dataSort={ true }>Product ID</TableHeaderColumn>*/}
      {/*  <TableHeaderColumn dataField='name' dataSort={ true }>Product Name</TableHeaderColumn>*/}
      {/*  <TableHeaderColumn dataField='price' dataSort={ true }>Product Price</TableHeaderColumn>*/}
      {/*</BootstrapTable>*/}
      {/*        </div>*/}
      {/*      </Container>*/}
      {/*    </Col>*/}
      {/*  </Row>*/}
      {/*</Container>*/}

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
      {props.showSamplesOrProjects === 'samples' && props.samples.length === 0
      && <div><p className="search-msg">No samples found</p></div>}

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
                        <ProjectDetailsModal
                          projectID={item}
                        />
                        {/*<Button size={'sm'} className="btn-secondary" target='_blank'*/}
                        {/*        href={'https://www.ncbi.nlm.nih.gov/bioproject/' + item}>*/}
                        {/*  PRJNA{item}*/}
                        {/*</Button>*/}
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
      {props.showSamplesOrProjects === 'projects' && props.projectIDs.length === 0 &&
      <div><p className="search-msg">No projects found</p></div>}
    </>
  );

}