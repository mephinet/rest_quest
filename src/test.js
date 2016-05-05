import './store';
import Cell from './components/Cell';
import * as events from './events';

import expect from 'expect';
import {Map, fromJS} from 'immutable';

import movement from './reducers/movement';

expect(movement(undefined, {})).toEqual(new Map());
expect(movement(new Map(), {type: 'unknown'})).toEqual(new Map());

// ignore first UPDATE_VIEW
expect(movement(new Map(), {type: events.UPDATE_VIEW})).toEqual(new Map());

// one step north onto grass
const myPos = {x: 2, y: 4};
const thisCell = new Cell({data: {type: 'grass'}, position: myPos});
const nextCell = new Cell({data: {type: 'grass'}, position: {x: 2, y: 3}});
const thenCell = new Cell({data: {type: 'mountain'}, position: {x: 1, y: 3}});

const initial = fromJS({qm: {strategy: {route: 'nxy'},
                             rows: [[], [], [],
                                    [null, thenCell, nextCell],
                                    [null, null, thisCell]
                                   ],
                             myPos}});
const expected1 = new Map({step: 'n', cost: 1});
expect(movement(new Map(), {type: events.MOVE, map: initial})).toEqual(expected1);
// one MOVE, then we're done
expect(movement(expected1, {type: events.UPDATE_VIEW})).toEqual(new Map());

// one step west onto a mountain
const next = initial.setIn(['qm', 'strategy', 'route'], 'wxy')
      .setIn(['qm', 'myPos'], fromJS({x: 2, y: 3}));
const expected2 = new Map({step: 'w', cost: 2});
expect(movement(new Map(), {type: events.MOVE, map: next})).toEqual(expected2);

// second round of this step, map hasn't changed
const expected3 = new Map({step: 'w', cost: 1});
expect(movement(expected2, {type: events.UPDATE_VIEW})).toEqual(expected3);
expect(movement(expected3, {type: events.MOVE, map: next})).toEqual(expected3);

// after two moves, we're done
expect(movement(expected3, {type: events.UPDATE_VIEW})).toEqual(new Map());


console.log('Tests passed!');
