import {List} from 'immutable';

const counters = (state = List(), action) => {

    switch (action && action.type) {
    case 'INCREMENT':
        return state.update(action.id, v => v + 1);
    case 'DECREMENT':
        return state.update(action.id, v => v - 1);
    case 'ADD_COUNTER':
        return state.push(0);
    default:
        return state;
    }
};

export default counters;
