import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React, {useState} from 'react';
import Table from "react-bootstrap/Table";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

export default function SampleDetailsModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function truncateString(str, num) {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
  };

  function extractTermID(termUri) {
    let separator;
    if (termUri.includes('_')) {
      separator = '_';
    }
    else if (termUri.includes('#')) {
      separator = '#';
    }
    else if (termUri.includes('/')) {
      separator = '/';
    }
    else {
      console.error('Invalid term uri: ' + termUri);
    }
    return termUri.substring(termUri.lastIndexOf(separator) + 1);
  };

  function getValueInCurieFormat(attribute) {
    if (attribute.attributeValueTermUri) {
      return attribute.attributeValueTermSource + ':' + extractTermID(attribute.attributeValueTermUri);
    }
  };

  function renderPopOver(attribute) {
    return (
      <Popover id="popover-basic">
        <Popover.Title as="h3">Term details</Popover.Title>
        <Popover.Content>
          <Table size={'sm'} striped bordered>
            <tbody>
            <tr>
              <td>Label</td>
              <td><strong>{attribute.attributeValueTermLabel}</strong></td>
            </tr>
            <tr>
              <td>URI</td>
              <td><a href={attribute.attributeValueTermUri} target='_blank'>{attribute.attributeValueTermUri}</a></td>
            </tr>
            <tr>
              <td>Source</td>
              <td>{attribute.attributeValueTermSource}</td>
            </tr>
            </tbody>
          </Table>
        </Popover.Content>
      </Popover>);
  };

  return (
    <>
      <Button size={'sm'}
              className={props.highlighted? "btn-secondary btn-secondary-fixed-width btn-samples-highlighted" : "btn-secondary btn-secondary-fixed-width"} onClick={handleShow}>
        {props.sample.biosampleAccession}
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Sample Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table className="result-details-modal" size={'sm'} striped bordered hover variant={'dark'}>
            <tbody>
            <tr>
              <td>Sample ID</td>
              <td>{props.sample.biosampleAccession}
              <Button size="sm" variant="link" href={props.sample.biosampleUrl} target='blank'>View in BioSample</Button></td>
            </tr>
            <tr>
              <td>Project ID</td>
              <td>{props.sample.bioprojectAccession ? props.sample.bioprojectAccession : "NA"}</td>
            </tr>
            <tr>
              <td>Organism</td>
              <td>{props.sample.organism}</td>
            </tr>
            {props.sample.attributes.map((item, index) => (
              <tr key={index} className={props.relevantAttributes.includes(item.attributeName) ? 'highlighted-result' : ''}>
              {/*<tr key={index} className={props.relevantAttributes.includes(item.attributeName? 'highlighted-result' : 'ble')}>*/}
                <td>{item.attributeName}</td>
                <td>{truncateString(item.attributeValue, 200)}
                  {item.attributeValueTermUri &&
                  <OverlayTrigger
                    trigger="click"
                    placement="auto"
                    rootClose={true}
                    overlay={renderPopOver(item)}>
                    <Button className='ml-2' size={'sm'} variant="secondary">
                      {getValueInCurieFormat(item)}
                    </Button>
                  </OverlayTrigger>
                  }
                </td>
              </tr>
            ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};