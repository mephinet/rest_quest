import {createStore, applyMiddleware} from 'redux';
import {combineReducers} from 'redux-immutable';

import map from './reducers/map';
import config from './reducers/config';
import movement from './reducers/movement';

const app = combineReducers({
    map,
    config,
    movement
});

let middlewares = [];

// import createLogger from 'redux-logger';
// const logger = createLogger({colors: false });
// middlewares.push(logger);

const store = createStore(app, applyMiddleware(...middlewares));

export default store;
