import {createStore, applyMiddleware} from 'redux';
import {combineReducers} from 'redux-immutable';

import config from './reducers/config';
import qm from './reducers/qm';
import phase from './reducers/phase';
import movement from './reducers/movement';

const app = combineReducers({
    config,
    qm,
    phase,
    movement
});

let middlewares = [];

// import createLogger from 'redux-logger';
// const logger = createLogger({colors: false,
//                              stateTransformer: s => s.setIn(['qm', 'rows'], '...'),
//                              actionTransformer: a => {
//                                  if (a.rows) a.rows = '...';
//                                  if (a.view) a.view = '...';
//                                  return a;
//                              }
//                             });
// middlewares.push(logger);

const store = createStore(app, applyMiddleware(...middlewares));

export default store;
