import {createStore} from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import Counters from './views/Counters';
import counter from './counter';
import order from './order';
import {Map} from 'immutable';

const app = (state = Map({reverse: false}), action)  => {
    return order(state, action)
        .set('counters', counter(state.get('counters'), action));
};

const store = createStore(app);

const render = () => {
    console.log(store.getState().toJS());
    ReactDOM.render(
            <Counters
               values={store.getState().get("counters")}
               reverse={store.getState().get("reverse")}
               addCounter={() => store.dispatch({type: 'ADD_COUNTER'})}
               onIncrement={i => store.dispatch({type: 'INCREMENT', id: i})}
               onDecrement={i => store.dispatch({type: 'DECREMENT', id: i})}
               onToggleReverse={() => store.dispatch({type: 'REVERSE'})}
            />,
            document.getElementById('root')
    );
};

store.subscribe(render);
render();
