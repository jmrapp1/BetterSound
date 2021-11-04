import UserRegisterResource from '../../../../../shared/resources/user/UserRegisterResource';
import * as Reducer from './reducers';
import UserLoginResource from '../../../../../shared/resources/user/UserLoginResource';
import UserRegisterMapper from '../../../../../shared/mappers/user/UserRegisterMapper';
import {BadRequestError} from '../../../../../shared/errors/BadRequestError';
import UserLoginMapper from '../../../../../shared/mappers/user/UserLoginMapper';
import {dispatchGetRequest, dispatchPostRequest, dispatchPutRequest} from '../../utils/fetchUtils';
import UserCredsResource from "../../../../../shared/resources/user/UserCredsResource";
import UserCredsMapper from "../../../../../shared/mappers/user/UserCredsMapper";

const jwtDecode = require('jwt-decode');

export function setUserCreds(userCreds: UserCredsResource, successCallback, errorCallback) {
    return dispatch => {
        const localErrors = UserCredsMapper.verifyAllConstraints(userCreds);
        if (localErrors) return errorCallback(new BadRequestError(localErrors));
        return dispatchPutRequest('api/user/creds', JSON.parse(JSON.stringify(userCreds)), user => {
            successCallback(user);
            dispatch(Reducer.setUser(user));
        }, err => {
            errorCallback(err);
        });
    }
}

export function authenticate(successCallback, errorCallback) {
    return dispatchGetRequest('api/user/auth', data => {
        successCallback();
    }, err => {
        errorCallback(err);
    });
}

export function register(registerResource: UserRegisterResource, successCallback, errorCallback) {
    return dispatch => {
        const localErrors = UserRegisterMapper.verifyAllConstraints(registerResource);
        if (localErrors) return errorCallback(new BadRequestError(localErrors));
        return dispatchPostRequest('api/user/register', JSON.parse(JSON.stringify(registerResource)), data => {
            successCallback(data);
        }, err => {
            errorCallback(err);
        });
    }
}

export function login(loginResource: UserLoginResource, successCallback, errorCallback) {
    return dispatch => {
        const localErrors = UserLoginMapper.verifyAllConstraints(loginResource);
        if (localErrors) return errorCallback(new BadRequestError(localErrors));
        return dispatchPostRequest('api/user/login', JSON.parse(JSON.stringify(loginResource)), data => {
            localStorage.setItem('id_token', data.jwtToken);
            decodeUserDataToStoreFromLocal(dispatch);
            successCallback(data);
        }, err => {
            errorCallback(err);
        });
    }
}

export function decodeUserDataToStoreFromLocal(dispatch) {
    const token = localStorage.getItem('id_token');
    if (token) {
        const user = jwtDecode(token);
        dispatch(Reducer.login(user));
        return user;
    }
}

export function logout() {
    return dispatch => {
        dispatch(Reducer.logout());
        localStorage.removeItem('id_token');
    }
}
