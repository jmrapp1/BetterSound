import * as Reducer from './reducers';
import {getDeviceId} from "../../../utils/Device";

export function setClientSocket(clientSocket) {
    return dispatch => dispatch(Reducer.setClientSocket(clientSocket));
}

export function addDevice(deviceId, deviceName) {
        return dispatch => {
            if (deviceId !== getDeviceId()) {
                dispatch(Reducer.addDevice(deviceId, deviceName));
            }
        }
}

export function removeDevice(deviceId) {
    return dispatch => dispatch(Reducer.removeDevice(deviceId));
}
