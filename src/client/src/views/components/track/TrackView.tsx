import * as React from 'react';
import './TrackView.scss';
import {Button, Col, Image, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay} from "@fortawesome/free-solid-svg-icons";

const TrackView = ({track, onPlay}) => (
    <div className={'track-view'}>
        <Row className={'align-items-center'}>
            <Col md={1}>
                <div className={'track-icon'} onClick={() => onPlay(track)}>
                    <FontAwesomeIcon icon={faPlay} color={'white'} size={'2x'} />
                    <Image src={track.artwork_url} rounded/>
                </div>
            </Col>
            <Col md={11}>
                <Row>
                    <Col><h5>{track.title}</h5></Col>
                </Row>
                <Row>
                    <Col><p>{track?.user?.username}</p></Col>
                </Row>
            </Col>
        </Row>
    </div>
);

export default TrackView;
