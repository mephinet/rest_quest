import {createStore} from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import Counters from './views/Counters';
import counter from './counter';
import {Map} from 'immutable';

const app = (state = Map(), action)  => {
    return state.set('counters', counter(state.get('counters'), action));
};

const store = createStore(app);

const render = () => {
    console.log(store.getState().toJS());
    ReactDOM.render(
            <Counters value={store.getState().get("counters")}
               addCounter={() => store.dispatch({type: 'ADD_COUNTER'})}
               onIncrement={i => store.dispatch({type: 'INCREMENT', id: i})}
               onDecrement={i => store.dispatch({type: 'DECREMENT', id: i})}
            />,
            document.getElementById('root')
    );
};

store.subscribe(render);
render();
