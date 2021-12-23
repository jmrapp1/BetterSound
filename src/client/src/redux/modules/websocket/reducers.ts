import {ADD_DEVICE, REMOVE_DEVICE, SET_CLIENT_SOCKET} from "./constants";
import {ClientSocket} from "../../../ws/ClientSocket";

const initialState = {
    clientSocket: undefined,
    devices: {}
};

export const setClientSocket = (clientSocket: ClientSocket) => (
    { type: ADD_DEVICE, clientSocket }
);

export const addDevice = (deviceId, deviceName) => (
    { type: ADD_DEVICE, deviceId, deviceName }
);

export const removeDevice = (deviceId) => (
    { type: REMOVE_DEVICE, deviceId }
);

export default {
    ws: ( state = initialState, action ) => {
        switch (action.type) {
            case ADD_DEVICE: {
                if (!action.deviceId) return state;
                return {
                    ...state,
                    devices: {
                        ...state.devices,
                        [action.deviceId]: {
                            deviceId: action.deviceId,
                            deviceName: action.deviceName
                        }
                    }
                }
            }
            case REMOVE_DEVICE: {
                delete state.devices[action.deviceId];
                return {
                    ...state,
                    devices: { ...state.devices }
                }
            }
            case SET_CLIENT_SOCKET: {
                return {
                    ...state,
                    clientSocket: action.clientSocket
                }
            }
            case "REDUX_STORAGE_LOAD": {
                return {
                    ...initialState
                }
            }
            default:
                return state;
        }
    }
}
