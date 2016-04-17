import {Person} from './model/Person';
import expect from 'expect';
import {createStore} from 'redux';

const counter = (state = 0, action) => {

    switch (action && action.type) {
    case 'INCREMENT':
        return state + 1;
    case 'DECREMENT':
        return state - 1;
    default:
        return state;
    }
}

expect(counter(0, {type: 'INCREMENT'})).toEqual(1);
expect(counter(1, {type: 'INCREMENT'})).toEqual(2);
expect(counter(2, {type: 'DECREMENT'})).toEqual(1);
expect(counter(1, {type: 'DECREMENT'})).toEqual(0);

expect(counter(1, {type: 'WHATEVER'})).toEqual(1);
expect(counter(undefined)).toEqual(0);

console.log('Tests passed!');

const store = createStore(counter);

const render = () => {
    document.body.innerHTML = store.getState();
};

store.subscribe(render);
render();

document.addEventListener('click', () => {store.dispatch({type: 'INCREMENT'})});

global.app = function () {
    var christoph = new Person('Christoph', 'Burgdorf');
    console.log(christoph.fullName);
};
