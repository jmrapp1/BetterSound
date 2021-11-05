import * as React from 'react';
import './TrackView.scss';
import {Button, Col, Image, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPause, faPlay} from "@fortawesome/free-solid-svg-icons";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Actions as PlayerActions} from "../../../redux/modules/player";

class TrackView extends React.Component<{ track, player, pauseAudio, setTrack }> {

    render() {
        const isPlaying = this.props.player.playing && this.props.player.track.id === this.props.track.id;
        return (
            <div className={'track-view'}>
                <Row className={'align-items-center'}>
                    <Col md={1}>
                        <div className={'track-icon'} onClick={() => {
                            isPlaying ? this.props.pauseAudio() : this.props.setTrack(this.props.track)
                        }}>
                            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} color={'white'} size={'2x'}/>
                            <Image src={this.props.track.artwork_url} rounded/>
                        </div>
                    </Col>
                    <Col md={11}>
                        <Row>
                            <Col><h5>{this.props.track.title}</h5></Col>
                        </Row>
                        <Row>
                            <Col><p>{this.props.track?.user?.username}</p></Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(
    state => ({
        player: (state as any).player
    }),
    dispatch => ({
        setTrack: bindActionCreators(PlayerActions.setTrack, dispatch),
        pauseAudio: bindActionCreators(PlayerActions.pauseAudio, dispatch)
    })
)(TrackView);
