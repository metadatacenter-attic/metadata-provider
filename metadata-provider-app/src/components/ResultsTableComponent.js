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


export default function ResultsTableComponent(props) {

  function popoverSample(sample) {
    return (
      <Popover id="popover-basic" outOfBoundaries='true'
      >
        <Popover.Title as="h3">Sample Attributes</Popover.Title>
        <Popover.Content>
          {/*<a target="_blank" href={sample.biosampleUrl}>Link to BioSample</a>*/}
          <Table size={'sm'} striped bordered hover>
            <tbody>
            {/*<tr>*/}
            {/*  <td>Sample ID</td>*/}
            {/*  <td>{sample.biosampleAccession}</td>*/}
            {/*</tr>*/}
            {/*<tr>*/}
            {/*  <td>Project ID</td>*/}
            {/*  <td>{sample.bioprojectAccession ? sample.bioprojectAccession : "NA"}</td>*/}
            {/*</tr>*/}
            <tr>
              <td>Organism</td>
              <td>{sample.organism}</td>
            </tr>
            {sample.attributes.map((item, index) => (
              <tr key={index}>
                <td>{item.attributeName}</td>
                <td>{item.attributeValue}</td>
              </tr>
            ))}
            </tbody>
          </Table>
        </Popover.Content>
      </Popover>
    )
  }

  return (
    <>
      {props.showResults && props.showSamplesOrProjects === 'samples' &&
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
                        <OverlayTrigger trigger='click'
                                        rootClose='true'
                                        placement='auto'
                                        overlay={popoverSample(item)}
                                        // popperConfig={{
                                        //   modifiers: {
                                        //     preventOverflow: {
                                        //       enabled: false
                                        //     },
                                        //     hide: {enabled: false}
                                        //   }
                                        // }}
                        >
                          <Button variant="link">{item.biosampleAccession}</Button>
                        </OverlayTrigger>
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
      {props.showResults && props.showSamplesOrProjects === 'projects' &&
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