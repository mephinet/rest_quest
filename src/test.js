import expect from 'expect';
import counter from './counter';

expect(counter(0, {type: 'INCREMENT'})).toEqual(1);
expect(counter(1, {type: 'INCREMENT'})).toEqual(2);
expect(counter(2, {type: 'DECREMENT'})).toEqual(1);
expect(counter(1, {type: 'DECREMENT'})).toEqual(0);

expect(counter(1, {type: 'WHATEVER'})).toEqual(1);
expect(counter(undefined)).toEqual(0);

console.log('Tests passed!');
