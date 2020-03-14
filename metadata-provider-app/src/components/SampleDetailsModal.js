import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React, {useState} from 'react';
import Table from "react-bootstrap/Table";
import {REGCOGNIZED_BIOSAMPLE_ATT_NAMES} from "../constants"
import CurieButtonComponent from "./CurieButtonComponent";

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

  return (
    <>
      <Button size={'sm'}
              className={props.highlighted ? "btn-secondary btn-secondary-fixed-width btn-samples-highlighted" : "btn-secondary btn-secondary-fixed-width"}
              onClick={handleShow}>
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
          <Table className="result-details-modal" size={'md'} striped bordered hover variant={'dark'}>
            <tbody>
            <tr>
              <td className="sampleid-col"><strong>Sample Accession</strong></td>
              <td>{props.sample.biosampleAccession}
                <Button size="sm" variant="link" href={props.sample.biosampleUrl} target='blank'>View in
                  BioSample</Button></td>
            </tr>
            <tr>
              <td><strong>Project Accession</strong></td>
              <td>{props.sample.bioprojectAccession ? props.sample.bioprojectAccession : "NA"}</td>
            </tr>
            <tr>
              <td><strong>Organism</strong></td>
              <td>{props.sample.organism}</td>
            </tr>
            {props.sample.attributes.map((item, index) => (
              <tr key={index}
                  className={props.relevantAttributes.includes(item.attributeName) ? 'highlighted-result' : ''}>
                <td><strong>{item.attributeName}</strong>
                  {!REGCOGNIZED_BIOSAMPLE_ATT_NAMES.includes(item.attributeName) &&
                  <span> *</span>}
                  <CurieButtonComponent
                    termUri={item.attributeNameTermUri}
                    termLabel={item.attributeNameTermLabel}
                    termSource={item.attributeNameTermSource}
                  />
                </td>
                <td>{truncateString(item.attributeValue, 200)}
                  <CurieButtonComponent
                    termUri={item.attributeValueTermUri}
                    termLabel={item.attributeValueTermLabel}
                    termSource={item.attributeValueTermSource}
                  />
                </td>
              </tr>
            ))}
            </tbody>
          </Table>
        <p className="unrecognized-att-message">* Used-defined BioSample attribute (view <a href="https://www.ncbi.nlm.nih.gov/biosample/docs/attributes/"
                                                         target="_blank" rel="noopener noreferrer">list of attributes recognized by BioSample</a>)</p>

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
