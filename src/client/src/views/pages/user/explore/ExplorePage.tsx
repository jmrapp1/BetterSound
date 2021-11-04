import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Actions as UserActions} from '../../../../redux/modules/user/';

import './ExplorePage.scss'

class ExplorePage extends React.Component<{ history, loaded, me }> {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
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
            </div>
        );
    }
}

export default connect(
    state => ({
        me: (state as any).sc.me,
        loaded: (state as any).sc.loaded
    }),
    dispatch => ({
        setUserCreds: bindActionCreators(UserActions.setUserCreds, dispatch)
    })
)(ExplorePage);
