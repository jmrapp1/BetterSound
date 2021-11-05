import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Actions as SoundCloudActions} from '../../../redux/modules/soundcloud/';
import {Actions as PlayerActions} from '../../../redux/modules/player/';

import './AudioPlayer.scss'

class AudioPlayer extends React.Component<{ resetPlayer, playerState, reduxStorageLoaded }, { audio }> {

    constructor(props) {
        super(props);
        this.state = {
            audio: undefined
        }
        this.playTrack = this.playTrack.bind(this);
    }

    componentDidUpdate(prevProps: Readonly<{ resetPlayer; playerState; reduxStorageLoaded }>, prevState: Readonly<{ audio }>, snapshot?: any) {
        if (this.props.reduxStorageLoaded && !prevProps.reduxStorageLoaded) { // if page just loaded
            this.props.resetPlayer();
        } else if (this.props.reduxStorageLoaded && this.props.playerState.track) {
            if (this.props.playerState.track !== prevProps.playerState.track) {
                this.playTrack(this.props.playerState.track);
            } else if (this.props.playerState.playing !== prevProps.playerState.playing) { // elseif b/c when changing track play sets to true
                if (this.props.playerState.playing) {
                    this.state.audio.play();
                } else {
                    this.state.audio.pause();
                }
            }
        }
    }

    playTrack(track) {
        if (!track.id) return;
        SoundCloudActions.getTrackStream(track.id, url => {
            if (this.state.audio) {
                this.state.audio.pause();
            }
            console.log('Playing audio ' + url);
            const audio = new Audio(url);
            audio.play();
            this.setState({audio});
        }, () => {
        });
    }

    render() {
        return (
            <div></div>
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
)(AudioPlayer);
