import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Actions as UserActions} from '../../../../redux/modules/user/';
import {toast} from 'react-toastify';
import {Link} from 'react-router-dom';
import TextInput from "../../../common/components/inputs/TextInput";
import {Button, Col, Row} from "react-bootstrap";

import './SettingsPage.scss';
import UserCredsResource from "../../../../../../shared/resources/user/UserCredsResource";

class SettingsPage extends React.Component<{ setUserCreds, history, user }, { clientId, oauth }> {

    constructor(props) {
        super(props);
        this.state = {
            clientId: this.props.user.clientId,
            oauth: this.props.user.oauth,
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);
    }

    componentDidUpdate(prevProps: Readonly<{ setUserCreds; history; user }>, prevState: Readonly<{ clientId; oauth }>, snapshot?: any) {
        if (this.props.user.clientId !== prevProps.user.clientId) {
            this.setState({ clientId: this.props.user.clientId });
        }
        if (this.props.user.oauth !== prevProps.user.oauth) {
            this.setState({ oauth: this.props.user.oauth });
        }
    }

    onSuccess() {
        toast.success('Your SoundCloud credentials have been updated.', {
            position: toast.POSITION.TOP_CENTER
        });
    }

    onError(error) {
        toast.error(error.getError(), {
            position: toast.POSITION.TOP_CENTER
        });
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value} as any)
    }

    onSubmit() {
        this.props.setUserCreds(new UserCredsResource().init(
            this.state.clientId, this.state.oauth
        ), this.onSuccess, this.onError);
    }

    render() {
        return (
            <div id='settings-page'>
                <h4>SoundCloud User Settings</h4>
                <div className={'settings-input-group'}>
                    <Row>
                        <Col md={12}>
                            <p>Client ID:</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <TextInput
                                value={this.state.clientId}
                                onChange={this.onChange}
                                name='clientId'
                                placeholder='Enter your client ID'
                            />
                        </Col>
                    </Row>
                </div>
                <div className={'settings-input-group'}>
                    <Row>
                        <Col md={12}>
                            <p>OAuth Token:</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <TextInput
                                value={this.state.oauth}
                                onChange={this.onChange}
                                type='text'
                                name='oauth'
                                placeholder='Enter your token'
                            />
                        </Col>
                    </Row>
                </div>
                <Row>
                    <Col md={{span: 3, offset: 9}}>
                        <Button variant="primary" onClick={this.onSubmit}>Save</Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(
    state => ({
        user: (state as any).user.user
    }),
    dispatch => ({
        setUserCreds: bindActionCreators(UserActions.setUserCreds, dispatch)
    })
)(SettingsPage);
