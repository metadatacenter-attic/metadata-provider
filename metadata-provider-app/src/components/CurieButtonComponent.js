import React from 'react';
import Table from "react-bootstrap/Table";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";

export default function CurieButtonComponent(props) {

  function renderPopOver(termUri, termLabel, termSource) {
    return (
      <Popover id="popover-basic">
        <Popover.Title as="h3">Term details</Popover.Title>
        <Popover.Content>
          <Table size={'sm'} striped bordered>
            <tbody>
            <tr>
              <td>Label</td>
              <td><strong>{termLabel}</strong></td>
            </tr>
            <tr>
              <td>URI</td>
              <td><a href={termUri} target='_blank' rel="noopener noreferrer">{termUri}</a></td>
            </tr>
            <tr>
              <td>Source</td>
              <td>{termSource}</td>
            </tr>
            </tbody>
          </Table>
        </Popover.Content>
      </Popover>);
  };


  function generateCurie(termSource, termUri) {
    if (termUri) {
      return termSource.toLowerCase() + ':' + extractTermID(termUri);
    }
  };

  function extractTermID(termUri) {
    let separator;
    if (termUri.includes('_')) {
      separator = '_';
    } else if (termUri.includes('#')) {
      separator = '#';
    } else if (termUri.includes('/')) {
      separator = '/';
    } else {
      console.error('Invalid term uri: ' + termUri);
    }
    return termUri.substring(termUri.lastIndexOf(separator) + 1);
  };

  return (
    <>
      {props.attributeValueTermUri &&
      <OverlayTrigger
        trigger="click"
        placement="auto"
        rootClose={true}
        overlay={
          renderPopOver(props.attributeValueTermUri, props.attributeValueTermLabel,props.attributeValueTermSource)
        }>
        <Button className='ml-2 btn-secondary btn-secondary-curie' size={'sm'} variant="secondary">
          {generateCurie(props.attributeValueTermSource, props.attributeValueTermUri)}
        </Button>
      </OverlayTrigger>
      }
    </>
  );

  // return (
  //   <>
  //     {props.attributeValuesAggMap && Object.keys(props.attributeValuesAggMap).length > 0 &&
  //     <Container>
  //       <Row>
  //         <Col>
  //           <Container>
  //             <div className="results results-large">
  //               <Table size={'sm'} striped bordered hover variant="dark">
  //                 <thead>
  //                 <tr>
  //                   <th>#</th>
  //                   <th>{props.content}</th>
  //                   <th>No. samples</th>
  //                 </tr>
  //                 </thead>
  //                 <tbody>
  //                 {Object.keys(props.attributeValuesAggMap).map((key, index) => (
  //                   <tr key={key}>
  //                     <td>{index + 1}</td>
  //                     {/*<td>{props.attributeValuesAggMap[key]["attributeValue"]}</td>*/}
  //
  //                         <td>{props.attributeValuesAggMap[key]["attributeValue"]}
  //                           {props.attributeValuesAggMap[key]["attributeValueTermUri"] &&
  //                           <OverlayTrigger
  //                             trigger="click"
  //                             placement="auto"
  //                             rootClose={true}
  //                             overlay={renderPopOver(props.attributeValuesAggMap[key]["attributeValueTermUri"], props.attributeValuesAggMap[key]["attributeValueTermLabel"],
  //                               props.attributeValuesAggMap[key]["attributeValueTermSource"])}>
  //                             <Button className='ml-2 btn-secondary btn-secondary-curie' size={'sm'} variant="secondary">
  //                               {generateCurie(props.attributeValuesAggMap[key]["attributeValueTermSource"], props.attributeValuesAggMap[key]["attributeValueTermUri"])}
  //                             </Button>
  //                           </OverlayTrigger>
  //                           }
  //                         </td>
  //
  //
  //
  //
  //                     <td>{props.attributeValuesAggMap[key]["count"]}</td>
  //                   </tr>
  //                 ))}
  //                 </tbody>
  //               </Table>
  //             </div>
  //           </Container>
  //         </Col>
  //       </Row>
  //     </Container>}
  //     {!props.attributeValuesAggMap || props.attributeValuesAggMap.length === 0
  //     && <div><p className="search-msg">No {props.content.toLowerCase()} found</p></div>}
  //   </>
  // );
}