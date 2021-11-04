import * as React from 'react';
import {Actions as UserActions} from '../../../../redux/modules/user';
import {Actions as SoundCloudActions} from '../../../../redux/modules/soundcloud';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import NavBar from "../navbar/NavBar";

import './UserHomePage.scss';
import {Route, Switch} from "react-router";
import SettingsPage from "../settings/SettingsPage";
import {Container} from "react-bootstrap";
import ExplorePage from "../explore/ExplorePage";

class UserHomePage extends React.Component<{ me, getMe, logout, loggedIn, history, reduxStorageLoaded }> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.reduxStorageLoaded && !this.props.loggedIn) {
            this.props.history.push('/');
        }
    }

    doOnInitialLoad() {
        this.props.getMe();
    }

    componentDidUpdate(prevProps: Readonly<{ logout, loggedIn, history, reduxStorageLoaded }>, prevState: Readonly<{}>, snapshot?: any) {
        if (this.props.reduxStorageLoaded && !this.props.loggedIn) {
            this.props.history.push('/');
        }
        if (this.props.reduxStorageLoaded && !prevProps.reduxStorageLoaded) { // if page just loaded
            UserActions.authenticate(() => {
                this.doOnInitialLoad();
            }, () => {
                this.props.logout();
                this.props.history.push('/');
            });
        }
    }

    render() {
        return (
            <div id='user-home-page'>
                <div>
                    <NavBar/>
                </div>
                <Container id='user-home-content'>
                    <Switch>
                        <Route exact path='/user' component={ExplorePage}/>
                        <Route exact path='/user/settings' component={SettingsPage}/>
                    </Switch>
                </Container>
            </div>
        );
    }

}

export default connect(
    state => ({
        loggedIn: (state as any).user.loggedIn,
        reduxStorageLoaded: (state as any).main.reduxStorageLoaded
    }),
    dispatch => ({
        getMe: bindActionCreators(SoundCloudActions.getMe, dispatch),
        logout: bindActionCreators(UserActions.logout, dispatch)
    })
)(UserHomePage);
