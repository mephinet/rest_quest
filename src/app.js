import {createStore} from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import Counter from './views/Counter';
import counter from './counter';

const store = createStore(counter);
const render = () => {
    ReactDOM.render(
            <Counter value={store.getState()}
               onIncrement={() => store.dispatch({type: 'INCREMENT'})}
               onDecrement={() => store.dispatch({type: 'DECREMENT'})}
            />,
        document.getElementById('root')
    );
};

store.subscribe(render);
render();
