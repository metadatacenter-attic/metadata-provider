import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React, {useState} from 'react';
import Table from "react-bootstrap/Table";

export default function ProjectDetailsModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button size={'sm'}
              className={props.highlighted? "btn-secondary btn-secondary-fixed-width btn-projects-highlighted" : "btn-secondary btn-secondary-fixed-width"} onClick={handleShow}>
        PRJNA{props.projectID}
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Project Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table className="result-details-modal" size={'sm'} striped bordered hover variant={'dark'}>
            <tbody>
            <tr>
              <td>Project ID</td>
              <td>PRJNA{props.projectID}
                <Button size="sm" variant="link"
                        href={'https://www.ncbi.nlm.nih.gov/bioproject/' + props.projectID}
                        target='blank'>See in BioProject</Button></td>
            </tr>
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