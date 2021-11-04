import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Actions as SoundCloudActions} from '../../../../redux/modules/soundcloud/';

import './ExplorePage.scss'
import TrackView from "../../../components/track/TrackView";

class ExplorePage extends React.Component<{ getHistory, loaded, me, trackHistory }, { audio }> {

    constructor(props) {
        super(props);
        this.state = {
            audio: undefined
        }
        this.playTrack = this.playTrack.bind(this);
        this.onPlay = this.onPlay.bind(this);
    }

    componentDidMount() {
        if (this.props.loaded) {
            this.props.getHistory();
        }
    }

    componentDidUpdate(prevProps: Readonly<{ getHistory; loaded; me }>, prevState: Readonly<{}>, snapshot?: any) {
        if (this.props.loaded && !prevProps.loaded) {
            this.props.getHistory();
        }
    }

    playTrack(url) {
        if (this.state.audio) {
            this.state.audio.pause();
        }
        console.log('Playing audio ' + url);
        const audio = new Audio(url);
        audio.play();
        this.setState({audio});
    }

    onPlay(trackId: string) {
        SoundCloudActions.getTrackStream(trackId, url => {
            this.playTrack(url);
        }, () => {});
    }

    renderNotLoaded() {
        return (
            <div id='explore-page'>

            </div>
        )
    }

    render() {
        if (!this.props.loaded) {
            return this.renderNotLoaded();
        }
        return (
            <div id='explore-page'>
                <h4>Hi {this.props.me.first_name}!</h4>
                <hr />
                {
                    this.props.trackHistory.map(h => <TrackView key={h.track.id} track={h.track} onPlay={this.onPlay} />)
                }
            </div>
        );
    }
}

export default connect(
    state => ({
        me: (state as any).sc.me,
        trackHistory: (state as any).sc.history,
        loaded: (state as any).sc.loaded
    }),
    dispatch => ({
        getHistory: bindActionCreators(SoundCloudActions.getHistory, dispatch)
    })
)(ExplorePage);
