import React, {useState} from 'react';
import {Button} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";


export default function SearchResultsModalComponent(props) {

  const [modalShow, setModalShow] = useState(false);

  return (
    <ButtonToolbar>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Launch modal with grid
      </Button>

      <Modal
        show={modalShow}
        size="xl"
        onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Search results
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="results">
            <p>Number of samples found: {props.samples.length}</p>
            <Table
              size="sm"
              striped
              bordered
              hover
              variant="dark">
              <thead>
              <tr>
                <th>#</th>
                <th>BioSample ID</th>
                <th>Name</th>
                {/*<th>BioProject ID</th>*/}
              </tr>
              </thead>
              <tbody>
              {props.samples.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td><a href={item.biosampleUrl}>{item.biosampleAccession}</a></td>
                  <td>{item.sampleName ? item.sampleName : 'NA'}</td>
                  {/*<td>{item.bioprojectAccession}</td>*/}
                </tr>
              ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </ButtonToolbar>
  );

};