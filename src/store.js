import {createStore, applyMiddleware} from 'redux';
import {combineReducers} from 'redux-immutable';
import createLogger from 'redux-logger';

import map from './reducers/map';
import config from './reducers/config';
import movement from './reducers/movement';

const app = combineReducers({
    map,
    config,
    movement
});

const logger = createLogger({colors: false});
const store = createStore(app, applyMiddleware(logger));

export default store;
