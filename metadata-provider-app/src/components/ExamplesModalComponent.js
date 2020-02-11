import React, {useState} from 'react';
import {Button} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";

export default function ExamplesModalComponent(props) {

  const [activeExample, setActiveExample] = useState(null);

  function setActive(e, index) {
    if (activeExample === index) { // unselect
      setActiveExample(null)
      props.setSampleQueryIndex(null);
    }
    else {
      setActiveExample(index);
      props.setSampleQueryIndex(index);
    }
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable="true"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Find all studies using...
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          {props.sampleQueries.map((item, index) => (
            <ListGroup.Item variant="info" action key={index} active={activeExample===index} onClick={e => setActive(e,index)}><i>...{item.researchQuestion}</i></ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}