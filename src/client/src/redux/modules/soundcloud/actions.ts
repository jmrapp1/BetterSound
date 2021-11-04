import * as Reducer from './reducers';
import {dispatchGetRequest, dispatchPostRequest} from '../../utils/fetchUtils';

export function getMe(errorCallback) {
    return dispatch => {
        return dispatchGetRequest('api/sc/me', me => {
            dispatch(Reducer.setMe(me));
        }, err => {
            errorCallback(err);
        });
    }
}

export function getHistory(errorCallback) {
    return dispatch => {
        return dispatchGetRequest('api/sc/history', history => {
            dispatch(Reducer.setHistory(history.collection));
        }, err => {
            errorCallback(err);
        });
    }
}

export function getTrackStream(trackId, successCallback, errorCallback) {
    return dispatchGetRequest('api/sc/stream?trackId=' + trackId, stream => {
        successCallback(stream.url);
    }, err => {
        errorCallback(err);
    });
}
