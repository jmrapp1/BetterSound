import * as React from 'react';
import './TrackView.scss';
import {Button, Col, Row} from "react-bootstrap";

const TrackView = ({ track, onPlay }) => (
    <div className={'track-view'}>
        <Row>
           <Col><h5>{track.title}</h5></Col>
        </Row>
        <Row>
            <Col><p>{track?.user?.username}</p></Col>
        </Row>
        <Row>
            <Col><Button variant="primary" onClick={() => onPlay(track.id)}>Play</Button></Col>
        </Row>
    </div>
);

export default TrackView;
