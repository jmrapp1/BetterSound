import { combineReducers } from 'redux';
import * as storage from 'redux-storage'
import { Reducer as UserReducer } from './modules/user/';
import { Reducer as SoundCloudReducer } from './modules/soundcloud/';
import MainReducer from './modules/main/reducers';

export default storage.reducer(combineReducers({
    ...UserReducer,
    ...MainReducer,
    ...SoundCloudReducer
}));
