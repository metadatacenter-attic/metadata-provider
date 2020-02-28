import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React, {useState} from 'react';
import Table from "react-bootstrap/Table";

export default function SampleDetailsModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function truncateString(str, num) {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
  }

  return (
    <>
      <Button size={'sm'}
              className={props.highlighted? "btn-secondary btn-secondary-fixed-width btn-samples-highlighted" : "btn-secondary btn-secondary-fixed-width"} onClick={handleShow}>
        {props.sample.biosampleAccession}
      </Button>



      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
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
              <Button size="sm" variant="link" href={props.sample.biosampleUrl} target='blank'>See in BioSample</Button></td>
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
                <td>{truncateString(item.attributeValue, 200)}</td>
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