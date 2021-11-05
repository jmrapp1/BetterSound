import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Actions as SoundCloudActions} from '../../../../redux/modules/soundcloud/';
import {Actions as PlayerActions} from '../../../../redux/modules/player/';

import './ExplorePage.scss'
import TrackView from "../../../components/track/TrackView";
import AudioPlayer from "../../../components/player/AudioPlayer";

class ExplorePage extends React.Component<{ getHistory, loaded, me, trackHistory }, { audio }> {

    constructor(props) {
        super(props);
        this.state = {
            audio: undefined
        }
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

    renderNotLoaded() {
        return (
            <div id='explore-page'>

            </div>
        )
    }

    renderLoaded() {
        return (
            <div>
                <h4>Hi {this.props.me.first_name}!</h4>
                <hr />
                {this.props.trackHistory.map(h => <TrackView key={h.track.id} track={h.track}/>)}
            </div>
        )
    }

    render() {
        return (
            <div id='explore-page'>
                <AudioPlayer />
                { this.props.loaded ? this.renderLoaded() : this.renderNotLoaded() }
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
