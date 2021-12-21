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
import {ClientSocket} from "../../../ws/ClientSocket";
import {WsPlayNewTrackEvent} from "../../../../../shared/ws/events/WsPlayNewTrackEvent";
import {WsCurrentTimeEvent} from "../../../../../shared/ws/events/WsCurrentTimeEvent";
import {WsPlayCurrentTrackEvent} from "../../../../../shared/ws/events/WsPlayCurrentTrackEvent";
import {WsPauseCurrentTrackEvent} from "../../../../../shared/ws/events/WsPauseCurrentTrackEvent";


class AudioPlayer extends React.Component<{
    resetPlayer, playerState, reduxStorageLoaded,
    playAudio, pauseAudio, setTrack, setAudio,
    setDuration, setCurrentTime
}, {
    audio: HTMLAudioElement, volume: number, clientSocket: ClientSocket,
    syncCount: number, owningPlayer: boolean, lastOwningSync: number
}> {

    constructor(props) {
        super(props);
        this.pauseTrack = this.pauseTrack.bind(this)
        this.playTrack = this.playTrack.bind(this);
        this.onTrackSeeked = this.onTrackSeeked.bind(this);
        this.onPlayPauseTrack = this.onPlayPauseTrack.bind(this);
        this.onPlayNewTrack = this.onPlayNewTrack.bind(this);
        this.onWsEvent = this.onWsEvent.bind(this);
        this.playNewTrack = this.playNewTrack.bind(this);
        this.onTrackVolume = this.onTrackVolume.bind(this);
        this.onAudioTimeChange = this.onAudioTimeChange.bind(this);
        this.onAudioEnded = this.onAudioEnded.bind(this);
        this.disposeAudio = this.disposeAudio.bind(this);

        this.state = {
            audio: undefined,
            volume: 1,
            clientSocket: new ClientSocket({
                onEvent: this.onWsEvent
            }),
            syncCount: 0,
            owningPlayer: false,
            lastOwningSync: 0
        }
    }

    addEventListeners() {
        addEventListener(EVENT_TRACK_SEEKED, this.onTrackSeeked);
        addEventListener(EVENT_TRACK_PLAY_PAUSED, this.onPlayPauseTrack);
        addEventListener(EVENT_TRACK_PLAY_TRACK, this.onPlayNewTrack);
        addEventListener(EVENT_TRACK_VOLUME, this.onTrackVolume);
    }

    removeEventListeners() {
        removeEventListener(EVENT_TRACK_SEEKED, this.onTrackSeeked);
        removeEventListener(EVENT_TRACK_PLAY_PAUSED, this.onPlayPauseTrack);
        removeEventListener(EVENT_TRACK_PLAY_TRACK, this.onPlayNewTrack);
        removeEventListener(EVENT_TRACK_VOLUME, this.onTrackVolume);
    }

    componentDidMount() {
        this.addEventListeners();
        this.state.clientSocket.connect();
    }

    componentWillUnmount() {
        this.removeEventListeners();
        this.state.clientSocket.close();
        this.disposeAudio();
    }

    componentDidUpdate(prevProps: Readonly<{ resetPlayer; playerState; reduxStorageLoaded }>, prevState: Readonly<{ audio }>, snapshot?: any) {
        if (this.props.reduxStorageLoaded && !prevProps.reduxStorageLoaded) { // if page just loaded
            this.props.resetPlayer();
        }
    }

    disposeAudio() {
        if (this.state.audio) {
            this.state.audio.pause();
            this.state.audio.removeEventListener('ended', this.onAudioEnded);
            this.state.audio.removeEventListener('timeupdate', this.onAudioTimeChange);
            this.state.audio.remove();
        }
    }

    /**
     * * * * * * * * * * * * * * * * * * * * * * * *
     * WEBSOCKET EVENTS
     * * * * * * * * * * * * * * * * * * * * * * * *
     */
    async onWsEvent(event) {
        if (event.type === WsPlayNewTrackEvent.EVENT_TYPE) {
            await this.playNewTrack(event.payload.track, false, event.payload.url);
        } else if (event.type === WsCurrentTimeEvent.EVENT_TYPE && this.state.audio) {
            this.state.audio.currentTime = event.payload.currentTime + event.audioLatency;
        } else if (event.type === WsPlayCurrentTrackEvent.EVENT_TYPE && this.state.audio) {
            this.state.audio.currentTime = event.payload.currentTime + event.audioLatency;
            await this.playTrack();
        } else if (event.type === WsPauseCurrentTrackEvent.EVENT_TYPE && this.state.audio) {
            this.pauseTrack();
            this.state.audio.currentTime = event.payload.currentTime;
        }
    }

    /**
     * * * * * * * * * * * * * * * * * * * * * * * *
     * CLIENT DOCUMENT EVENTS
     * * * * * * * * * * * * * * * * * * * * * * * *
     */
    onAudioTimeChange() {
        if (this.state.audio) {
            if (this.state.audio.currentTime < this.props.playerState.duration) {
                this.props.setCurrentTime(this.state.audio.currentTime); // update props

                // If this is the device that played the current track, keep clients in sync
                if (this.state.owningPlayer) {
                    if (this.state.syncCount < 15) { // Initial sync after starting
                        this.state.clientSocket.sendEvent(new WsCurrentTimeEvent(this.state.audio.currentTime));
                        this.setState({syncCount: this.state.syncCount + 1});
                    } else if (Date.now() - this.state.lastOwningSync >= 5000) { // Sync every 10 seconds
                        this.state.clientSocket.sendEvent(new WsCurrentTimeEvent(this.state.audio.currentTime));
                        this.setState({
                            lastOwningSync: Date.now()
                        });
                    }
                }
            } else {
                this.props.setCurrentTime(this.props.playerState.duration);
                this.onAudioEnded();
            }
        }
    }

    onAudioEnded() {
        this.pauseTrack();
    }

    onTrackSeeked(e) {
        this.state.audio.currentTime = this.state.audio.duration * e.detail.time;
        this.state.clientSocket.sendEvent(new WsCurrentTimeEvent(this.state.audio.currentTime));
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
            await this.playTrack();
            this.state.clientSocket.sendEvent(new WsPlayCurrentTrackEvent(this.state.audio.currentTime));
        } else {
            this.pauseTrack();
            this.state.clientSocket.sendEvent(new WsPauseCurrentTrackEvent(this.state.audio.currentTime));
        }
    }

    async onPlayNewTrack(e) {
        const track = e.detail?.track;
        await this.playNewTrack(track, true);
    }

    /**
     * * * * * * * * * * * * * * * * * * * * * * * *
     * UTILITY AUDIO FUNCTIONS
     * * * * * * * * * * * * * * * * * * * * * * * *
     */
    private async playNewTrack(track, owningPlayer: boolean, url?: string) {
        this.props.setTrack(track); // set to give immediate UI feedback
        if (!url) {
            url = await SoundCloudActions.getTrackStream(track.id);
        }

        // Cleanup existing audio
        if (this.state.audio) {
            this.disposeAudio();
        }

        // Play new audio
        const audio = new Audio(url);
        audio.volume = this.state.volume;
        await audio.play();
        audio.addEventListener('ended', this.onAudioEnded);
        audio.addEventListener('timeupdate', this.onAudioTimeChange);

        // Update state and props for UI
        this.setState({
            audio
        });
        this.props.setDuration(audio.duration);
        this.props.setAudio(audio);

        // If started playing on this device, send WS event
        if (owningPlayer) {
            this.state.clientSocket.sendEvent(new WsPlayNewTrackEvent(url, track));
            this.setState({
                syncCount: 0,
                owningPlayer: true,
                lastOwningSync: Date.now()
            });
        } else {
            this.setState({
                owningPlayer: false
            });
        }
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
