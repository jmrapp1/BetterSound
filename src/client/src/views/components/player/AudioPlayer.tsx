import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Actions as SoundCloudActions} from '../../../redux/modules/soundcloud/';
import {Actions as PlayerActions} from '../../../redux/modules/player/';
import {Actions as WsActions} from '../../../redux/modules/websocket/';

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
import {WsStatusRequestEvent} from "../../../../../shared/ws/events/WsStatusRequestEvent";
import {WsStatusUpdateEvent} from "../../../../../shared/ws/events/WsStatusUpdateEvent";
import {getDeviceId} from "../../../utils/Device";
import {WsDeviceConnectedEvent} from "../../../../../shared/ws/events/WsDeviceConnectedEvent";
import {WsDeviceDisconnectedEvent} from "../../../../../shared/ws/events/WsDeviceDisconnectedEvent";

class AudioPlayer extends React.Component<{
    resetPlayer, playerState, reduxStorageLoaded,
    playAudio, pauseAudio, setTrack, setAudio,
    addDevice, removeDevice, setClientSocket
    setDuration, setCurrentTime
}, {
    audio: HTMLAudioElement, volume: number, clientSocket: ClientSocket,
    track, trackUrl: string,
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
            track: undefined,
            trackUrl: undefined,
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
        this.props.setClientSocket(this.state.clientSocket);

        const audio = new Audio();
        audio.addEventListener('ended', this.onAudioEnded);
        audio.addEventListener('timeupdate', this.onAudioTimeChange);
        this.setState({audio});
        this.props.setAudio(audio);

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
        } else if (event.type === WsStatusRequestEvent.EVENT_TYPE) {
            this.state.clientSocket.sendEvent(new WsStatusUpdateEvent(event.payload.reqDeviceId, getDeviceId(), this.state.owningPlayer,
                this.state.track, this.state.trackUrl, this.props.playerState.currentTime, this.props.playerState.playing));
        } else if (event.type === WsStatusUpdateEvent.EVENT_TYPE) {
            const payload = (event as WsStatusUpdateEvent).payload;
            if (payload.track && payload.url && (!this.state.track?.id || payload.track.id !== this.state.track.id)) {
                await this.playNewTrack(payload.track, false, false, payload.url);
                this.state.audio.currentTime = payload.currentTime;
            }
        } else if (event.type === WsDeviceConnectedEvent.EVENT_TYPE) {
            this.props.addDevice(event.payload.deviceId, event.payload.deviceName);
        } else if (event.type === WsDeviceDisconnectedEvent.EVENT_TYPE) {
            this.props.removeDevice(event.payload.deviceId);
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
        // this.pauseTrack();
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
        await this.playNewTrack(track, true, true);
    }

    /**
     * * * * * * * * * * * * * * * * * * * * * * * *
     * UTILITY AUDIO FUNCTIONS
     * * * * * * * * * * * * * * * * * * * * * * * *
     */
    private async playNewTrack(track, owningPlayer: boolean, play: boolean, url?: string) {
        this.props.setTrack(track); // set to give immediate UI feedback
        if (!url) {
            url = await SoundCloudActions.getTrackStream(track.id);
        }

        // Play new audio
        this.state.audio.src = url;
        this.state.audio.load();
        await this.state.audio.play();
        if (!play) {
            // this.state.audio.pause();
        }

        // Setup new state
        let newState: any = {
            track,
            trackUrl: url
        }

        // If started playing on this device, send WS event
        if (owningPlayer) {
            this.state.clientSocket.sendEvent(new WsPlayNewTrackEvent(url, track));
            newState = {
                ...newState,
                syncCount: 0,
                owningPlayer: true,
                lastOwningSync: Date.now()
            };
        } else {
            newState = {
                ...newState,
                owningPlayer: false
            };
        }

        // Update state and props
        this.setState(newState);
        this.props.setDuration(this.state.audio.duration);
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
        pauseAudio: bindActionCreators(PlayerActions.pauseAudio, dispatch),
        setClientSocket: bindActionCreators(WsActions.setClientSocket, dispatch),
        addDevice: bindActionCreators(WsActions.addDevice, dispatch),
        removeDevice: bindActionCreators(WsActions.removeDevice, dispatch)
    })
)(AudioPlayer);
