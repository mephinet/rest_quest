import {createStore} from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import Counters from './views/Counters';
import counter from './counter';

const store = createStore(counter);
const render = () => {
    ReactDOM.render(
            <Counters value={store.getState()}
               addCounter={() => store.dispatch({type: 'ADD_COUNTER'})}
               onIncrement={i => store.dispatch({type: 'INCREMENT', id: i})}
               onDecrement={i => store.dispatch({type: 'DECREMENT', id: i})}
            />,
            document.getElementById('root')
    );
};

store.subscribe(render);
render();
