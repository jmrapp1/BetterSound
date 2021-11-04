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
