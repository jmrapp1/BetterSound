import * as React from 'react';
import {Col, Container, Row, Image} from 'react-bootstrap';

import './AudioBar.scss';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Actions as PlayerActions} from "../../../../redux/modules/player";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBackward, faForward, faPause, faPlay} from "@fortawesome/free-solid-svg-icons";

class AudioBar extends React.Component<{ playerState, playAudio, pauseAudio }, {}> {

    constructor(props) {
        super(props);
        this.onPlayPressed = this.onPlayPressed.bind(this);
    }

    onPlayPressed() {
        if (this.props.playerState.playing) {
            this.props.pauseAudio();
        } else {
            this.props.playAudio();
        }
    }

    render() {
        return (
            <div id={'audio-bar'} className={'fixed-bottom'}>
                <Container>
                    <Row>
                        <Col md={2} className={'my-auto'}>
                            <Row>
                                <Col md={2}/>
                                <Col md={8}>
                                    <Row id={'player-btns'}>
                                        <Col md={4} className={'d-flex justify-content-center'}>
                                            <FontAwesomeIcon id={'back-btn'} icon={faBackward} color={'white'}/>
                                        </Col>
                                        <Col md={4} className={'d-flex justify-content-center'}>
                                            <FontAwesomeIcon id={'play-btn'} icon={this.props.playerState.playing ? faPause : faPlay}
                                                             color={'white'} onClick={this.onPlayPressed}/>
                                        </Col>
                                        <Col md={4} className={'d-flex justify-content-center'}>
                                            <FontAwesomeIcon id={'forward-btn'} icon={faForward} color={'white'}/>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={2}/>
                            </Row>
                        </Col>
                        <Col md={8}>

                        </Col>
                        <Col md={2}>
                            <Row>
                                <Col md={4}><Image src={this.props.playerState.track?.artwork_url} rounded fluid/></Col>
                                <Col md={8}>
                                    <Row><Col><h5>{this.props.playerState.track?.title || 'N/A'}</h5></Col></Row>
                                    <Row><Col><p>{this.props.playerState.track?.user?.username || 'N/A'}</p></Col></Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default connect(
    state => ({
        playerState: (state as any).player,
        reduxStorageLoaded: (state as any).main.reduxStorageLoaded
    }),
    dispatch => ({
        resetPlayer: bindActionCreators(PlayerActions.resetPlayer, dispatch),
        playAudio: bindActionCreators(PlayerActions.playAudio, dispatch),
        pauseAudio: bindActionCreators(PlayerActions.pauseAudio, dispatch)
    })
)(AudioBar);
