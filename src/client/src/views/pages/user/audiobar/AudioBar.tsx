import * as React from 'react';
import {Col, Container, Row, Image} from 'react-bootstrap';

import './AudioBar.scss';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Actions as PlayerActions} from "../../../../redux/modules/player";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBackward, faForward, faPause, faPlay} from "@fortawesome/free-solid-svg-icons";
import {triggerEventPlayPauseTrack, triggerEventSeekTrack, triggerEventTrackVolume} from "../../../../utils/Events";
import {formatTimeString} from "../../../../utils/StringUtils";

class AudioBar extends React.Component<{ playerState }, { isSeeking: boolean, seekValue: number}> {

    constructor(props) {
        super(props);
        this.state = {
            isSeeking: false,
            seekValue: 0

        }
        this.onPlayPressed = this.onPlayPressed.bind(this);
        this.onSeekChanged = this.onSeekChanged.bind(this);
        this.onSeeking = this.onSeeking.bind(this);
    }

    onPlayPressed() {
        triggerEventPlayPauseTrack();
    }

    onSeeking(e) {
        this.setState({ isSeeking: true, seekValue: e.target.value});
    }

    onSeekChanged(e) {
        triggerEventSeekTrack(e.target.value);
        this.setState({ isSeeking: false });
    }

    onVolumeChanged(e) {
        triggerEventTrackVolume(e.target.value);
    }

    render() {
        return (
            <div id={'audio-bar'} className={'fixed-bottom'}>
                <Container>
                    <Row>
                        <Col md={3} className={'my-auto'}>
                            <Row>
                                <Col md={2}/>
                                <Col md={8}>
                                    <Row id={'player-btns'}>
                                        <Col md={4} className={'d-flex justify-content-center'}>
                                            <FontAwesomeIcon id={'back-btn'} icon={faBackward} color={'white'}/>
                                        </Col>
                                        <Col md={4} className={'d-flex justify-content-center'}>
                                            <FontAwesomeIcon id={'play-btn'}
                                                             icon={this.props.playerState.playing ? faPause : faPlay}
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
                        <Col md={6} className={'align-items-center my-auto'}>
                            <Row>
                                <Col md={1}><p></p></Col>
                                <Col md={9}>
                                    <Row>
                                        <Col md={2}><p>{
                                            this.state.isSeeking
                                            ? formatTimeString(this.state.seekValue * this.props.playerState.duration)
                                            : this.props.playerState.currentTimeFormatted
                                        }</p></Col>
                                        <Col md={8}>
                                            <input id="track-seek" type="range" className="form-range" min={0} max={0.999999}
                                                   step='any'
                                                   onInput={this.onSeeking}
                                                   onMouseUp={this.onSeekChanged}
                                                   value={this.state.isSeeking
                                                       ? this.state.seekValue
                                                       : this.props.playerState.currentTime / (this.props.playerState.duration || 1)}
                                            />
                                        </Col>
                                        <Col md={2}><p>{this.props.playerState.durationFormatted}</p></Col>
                                    </Row>
                                </Col>
                                <Col md={2}>
                                    <input type="range" className={'form-range'} step='any' min={0} max={0.999999}
                                           onInput={this.onVolumeChanged}/>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={3}>
                            <Row className={'align-items-center my-auto'}>
                                <Col md={4} className={'song-image text-end no-select'}><Image
                                    src={this.props.playerState.track?.artwork_url} rounded fluid/></Col>
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
        resetPlayer: bindActionCreators(PlayerActions.resetPlayer, dispatch)
    })
)(AudioBar);
