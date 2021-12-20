import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Actions as SoundCloudActions} from '../../../redux/modules/soundcloud/';
import {Actions as PlayerActions} from '../../../redux/modules/player/';

import './AudioPlayer.scss'
import {addEventListener, removeEventListener} from "../../../utils/Eventing";
import {
    EVENT_TRACK_PLAY_PAUSED,
    EVENT_TRACK_PLAY_TRACK,
    EVENT_TRACK_SEEKED,
    EVENT_TRACK_VOLUME
} from "../../../utils/Events";



class AudioPlayer extends React.Component<{
    resetPlayer, playerState, reduxStorageLoaded,
    playAudio, pauseAudio, setTrack, setAudio,
    setDuration, setCurrentTime
}, { audio: HTMLAudioElement, volume: number }> {

    constructor(props) {
        super(props);
        this.state = {
            audio: undefined,
            volume: 1
        }
        this.pauseTrack = this.pauseTrack.bind(this)
        this.playTrack = this.playTrack.bind(this);
        this.onTrackSeeked = this.onTrackSeeked.bind(this);
        this.onPlayPauseTrack = this.onPlayPauseTrack.bind(this);
        this.onPlayTrack = this.onPlayTrack.bind(this);
        this.onTrackVolume = this.onTrackVolume.bind(this);
        this.onAudioTimeChange = this.onAudioTimeChange.bind(this);
        this.onAudioEnded = this.onAudioEnded.bind(this);
    }

    addEventListeners() {
        addEventListener(EVENT_TRACK_SEEKED, this.onTrackSeeked);
        addEventListener(EVENT_TRACK_PLAY_PAUSED, this.onPlayPauseTrack);
        addEventListener(EVENT_TRACK_PLAY_TRACK, this.onPlayTrack);
        addEventListener(EVENT_TRACK_VOLUME, this.onTrackVolume);
    }

    removeEventListeners() {
        removeEventListener(EVENT_TRACK_SEEKED, this.onTrackSeeked);
        removeEventListener(EVENT_TRACK_PLAY_PAUSED, this.onPlayPauseTrack);
        removeEventListener(EVENT_TRACK_PLAY_TRACK, this.onPlayTrack);
        removeEventListener(EVENT_TRACK_VOLUME, this.onTrackVolume);
    }

    componentDidMount() {
        this.addEventListeners();
    }

    componentWillUnmount() {
        this.removeEventListeners();
    }

    componentDidUpdate(prevProps: Readonly<{ resetPlayer; playerState; reduxStorageLoaded }>, prevState: Readonly<{ audio }>, snapshot?: any) {
        if (this.props.reduxStorageLoaded && !prevProps.reduxStorageLoaded) { // if page just loaded
            this.props.resetPlayer();
        }
    }

    onAudioTimeChange(audioEvent: Event) {
        if (this.state.audio) {
            if (this.state.audio.currentTime < this.props.playerState.duration) {
                this.props.setCurrentTime(this.state.audio.currentTime);
            } else {
                this.props.setCurrentTime(this.props.playerState.duration);
                this.onAudioEnded();
                console.log('time exceeded duration; over');
            }
        }
    }

    onAudioEnded() {
        this.pauseTrack();
    }

    onTrackSeeked(e) {
        this.state.audio.currentTime = this.state.audio.duration * e.detail.time;
    }

    onTrackVolume(e) {
        if (this.state.audio) {
            this.state.audio.volume = e.detail.volume;
        }
        this.setState({volume: e.detail.volume});
    }

    async onPlayPauseTrack() {
        if (!this.props.playerState.track) {
            return;
        }
        if (this.state.audio.paused) {
            await this.playTrack()
        } else {
            this.pauseTrack();
        }
    }

    onPlayTrack(e) {
        const track = e.detail?.track;
        if (!track?.id) return;

        const currentTrack = this.props.playerState.track;
        this.props.setTrack(track); // set to give immediate UI feedback

        SoundCloudActions.getTrackStream(track.id, async url => {
            if (this.state.audio) {
                this.state.audio.pause();
                this.state.audio.remove();
                this.state.audio.onended
                this.state.audio.removeEventListener('ended', this.onAudioEnded);
                this.state.audio.removeEventListener('timeupdate', this.onAudioTimeChange);
            }

            const audio = new Audio(url);
            audio.volume = this.state.volume;

            await audio.play();
            audio.addEventListener('ended', this.onAudioEnded);
            audio.addEventListener('timeupdate', this.onAudioTimeChange);

            this.setState({ audio });
            this.props.setDuration(audio.duration);
            this.props.setAudio(audio);
        }, () => {
            this.props.setTrack(currentTrack); // reset to past track if error
        });
    }

    async playTrack() {
        await this.state.audio.play();
        this.props.playAudio();
    }

    pauseTrack() {
        this.state.audio.pause();
        this.props.pauseAudio();
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
        setTrack: bindActionCreators(PlayerActions.setTrack, dispatch),
        setAudio: bindActionCreators(PlayerActions.setAudio, dispatch),
        setCurrentTime: bindActionCreators(PlayerActions.setCurrentTime, dispatch),
        setDuration: bindActionCreators(PlayerActions.setDuration, dispatch),
        playAudio: bindActionCreators(PlayerActions.playAudio, dispatch),
        pauseAudio: bindActionCreators(PlayerActions.pauseAudio, dispatch)
    })
)(AudioPlayer);
