import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Actions as UserActions } from '../../../redux/modules/user/';
import './RegisterPage.scss';
import PrimaryButton from '../../common/components/buttons/PrimaryButton';
import TextInput from '../../common/components/inputs/TextInput';
import Container from '../../common/components/containers/Container';
import { toast } from 'react-toastify';
import UserRegisterResource from '../../../../../shared/resources/user/UserRegisterResource';
import { Link } from 'react-router-dom';

class RegisterPage extends React.Component<{ loggedIn, register, history, reduxStorageLoaded }, { email, password, confirmPassword }> {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);
    }

    componentDidMount() {
        if (this.props.reduxStorageLoaded && this.props.loggedIn) {
            this.props.history.push('/user');
        }
    }

    componentDidUpdate(prevProps: Readonly<{ register; history }>, prevState: Readonly<{ email; password; confirmPassword }>, snapshot?: any) {
        if (this.props.reduxStorageLoaded && this.props.loggedIn) {
            this.props.history.push('/user');
        }
    }

    onSuccess(message) {
        toast.success('You have registered successfully.', {
            position: toast.POSITION.TOP_CENTER
        });
        this.props.history.push('/')
    }

    onError(error) {
        toast.error(error.getError(), {
            position: toast.POSITION.TOP_CENTER
        });
    }

    onChange(e) {
        this.setState({ [ e.target.name ]: e.target.value } as any)
    }

    onSubmit() {
        this.props.register(new UserRegisterResource().init(
            this.state.email, this.state.password, this.state.confirmPassword
        ), this.onSuccess, this.onError);
    }

    render() {
        return (
            <div id='register-page'>
                <div className='col-sm-12 col-md-4 col-md-offset-4 vertical-center'>
                    <Container className='register-container'>
                        <form className='register'>
                            <h1 className='register-title'>Register</h1>

                            <div className='form-group'>
                                <TextInput
                                    value={ this.state.email }
                                    onChange={ this.onChange }
                                    name='email'
                                    placeholder='Email'
                                />

                                <TextInput
                                    value={ this.state.password }
                                    onChange={ this.onChange }
                                    type='password'
                                    name='password'
                                    placeholder='Password'
                                />

                                <TextInput
                                    value={ this.state.confirmPassword }
                                    onChange={ this.onChange }
                                    type='password'
                                    name='confirmPassword'
                                    placeholder='Confirm Password'
                                />
                            </div>
                        </form>
                        <p>Already have an account? <Link to='/login'>Login.</Link></p>

                        <div className='btn-group' id='button'>
                            <PrimaryButton text='Register' onClick={ this.onSubmit }/>
                        </div>
                    </Container>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ( {
        loggedIn: (state as any).user.loggedIn,
        reduxStorageLoaded: (state as any).main.reduxStorageLoaded
    } ),
    dispatch => ( {
        register: bindActionCreators(UserActions.register, dispatch)
    } )
)(RegisterPage);
