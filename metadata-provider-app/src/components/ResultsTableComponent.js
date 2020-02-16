import React from 'react';
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import {faStar} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Tooltip from "react-bootstrap/Tooltip";
import Overlay from "react-bootstrap/Overlay";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Button from "react-bootstrap/Button";
import SampleDetailsModal from "./SampleDetailsModal";


export default function ResultsTableComponent(props) {

  return (
    <>
      {props.showSamplesOrProjects === 'samples' &&
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
                    {props.db === 'annotated' && props.extraSampleIds.length > 0 &&
                    <th></th>
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
                      {props.db === 'annotated' && props.extraSampleIds.length > 0 &&
                      <td>{props.extraSampleIds.includes(item.biosampleAccession) &&
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
      {props.showSamplesOrProjects === 'projects' &&
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
      </Container>}
    </>
  );

}