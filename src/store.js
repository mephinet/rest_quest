import {createStore} from 'redux';
import {combineReducers} from 'redux-immutable';

import map from './reducers/map';
import config from './reducers/config';

const app = combineReducers({
    map,
    config
});

const store = createStore(app);

export default store;
