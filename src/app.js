import { createStore } from 'redux';
import { combineReducers } from 'redux-immutable';
import React from 'react';
import ReactDOM from 'react-dom';

import Counters from './views/Counters';

import counters from './reducers/counters';
import order from './reducers/order';

const app = combineReducers({
    reverse: order,
    counters
});

const store = createStore(app);

const render = () => {
    console.log(store.getState().toJS());
    ReactDOM.render(
            <Counters
               values={store.getState().get('counters')}
               reverse={store.getState().get('reverse')}
               onAddCounter={() => store.dispatch({type: 'ADD_COUNTER'})}
               onIncrement={i => store.dispatch({type: 'INCREMENT', id: i})}
               onDecrement={i => store.dispatch({type: 'DECREMENT', id: i})}
               onToggleReverse={() => store.dispatch({type: 'REVERSE'})}
            />,
            document.getElementById('root')
    );
};

store.subscribe(render);
render();
