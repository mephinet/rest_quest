import {createStore, applyMiddleware} from 'redux';
import {combineReducers} from 'redux-immutable';
import createLogger from 'redux-logger';

import map from './reducers/map';
import config from './reducers/config';

const app = combineReducers({
    map,
    config
});

const logger = createLogger({colors: false});
const store = createStore(app, applyMiddleware(logger));

export default store;
