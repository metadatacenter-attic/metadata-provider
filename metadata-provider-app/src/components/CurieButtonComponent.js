import React from 'react';
import Table from "react-bootstrap/Table";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import {ONTOLOGY_NAMES} from "../constants";

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
              <td>{getTermSourceName(termSource)}</td>
            </tr>
            </tbody>
          </Table>
        </Popover.Content>
      </Popover>);
  };

  function getTermSourceName(termSource) {
    if (ONTOLOGY_NAMES[termSource]) {
      return ONTOLOGY_NAMES[termSource] + ' (' + termSource + ')';
    }
    else {
      return termSource;
    }
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
      {props.termUri &&
      <OverlayTrigger
        trigger="click"
        placement="auto"
        rootClose={true}
        overlay={
          renderPopOver(props.termUri, props.termLabel,props.termSource)
        }>
        <Button className='ml-2 btn-secondary btn-secondary-curie' size={'sm'} variant="secondary">
          {generateCurie(props.termSource, props.termUri)}
        </Button>
      </OverlayTrigger>
      }
    </>
  );

}