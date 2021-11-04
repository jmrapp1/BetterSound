import * as React from 'react';
import {Actions as UserActions} from '../../../../redux/modules/user';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import NavBar from "../navbar/NavBar";

import './UserHomePage.scss';
import {Route, Switch} from "react-router";
import SettingsPage from "../settings/SettingsPage";
import {Container} from "react-bootstrap";

class UserHomePage extends React.Component<{ loggedIn, history, reduxStorageLoaded }> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.reduxStorageLoaded && !this.props.loggedIn) {
            this.props.history.push('/');
        }
    }

    componentDidUpdate(prevProps: Readonly<{ history }>, prevState: Readonly<{}>, snapshot?: any) {
        if (this.props.reduxStorageLoaded && !this.props.loggedIn) {
            this.props.history.push('/');
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
        login: bindActionCreators(UserActions.login, dispatch)
    })
)(UserHomePage);
