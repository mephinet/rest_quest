import expect from 'expect';
import counter from './counter';
import {List} from 'immutable';

expect(counter(undefined)).toEqual(List());

expect(counter(List(), {type: 'ADD_COUNTER'})).toEqual(List.of(0));
expect(counter(List.of(3), {type: 'ADD_COUNTER'})).toEqual(List.of(3, 0));

expect(counter(List.of(4, 5), {type: 'INCREMENT', id: 1})).toEqual(List.of(4, 6));

expect(counter(List.of(4, 9), {type: 'DECREMENT', id: 0})).toEqual(List.of(3, 9));

expect(counter(List.of(2, 3), {type: 'WHATEVER'})).toEqual(List.of(2, 3));

console.log('Tests passed!');
