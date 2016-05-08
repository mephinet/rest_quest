import events from '../events';

import expect from 'expect';
import {Map} from 'immutable';

import movement from '../reducers/movement';

const test = () => {

    expect(movement(undefined, {})).toEqual(new Map());
    expect(movement(new Map({foo: 42}), {type: 'unknown'})).toEqual(new Map({foo: 42}));

    // ignore first PROCESS_VIEW_UPDATE
    expect(movement(new Map(), {type: events.PROCESS_VIEW_UPDATE})).toEqual(new Map());

    // one step north onto grass
    const strategy1 = new Map({route: 'nxy', remainingCost: 1});
    const expected1 = new Map({step: 'n', remainingCost: 1});
    expect(movement(new Map(), {type: events.PREPARE_MOVE, strategy: strategy1})).toEqual(expected1);

    // after the move, we're done
    expect(movement(expected1, {type: events.PROCESS_VIEW_UPDATE})).toEqual(new Map());

    // one step west onto a mountain
    const strategy2 = new Map({route: 'wxy', remainingCost: 2});
    const expected2 = new Map({step: 'w', remainingCost: 2});
    expect(movement(new Map(), {type: events.PREPARE_MOVE, strategy: strategy2})).toEqual(expected2);

    // after the move, we reduce the remaining Cost
    const expected3 = new Map({step: 'w', remainingCost: 1});
    expect(movement(expected2, {type: events.PROCESS_VIEW_UPDATE})).toEqual(expected3);

    // and make another step
    const strategy4 = new Map({route: 'wxy', remainingCost: 1});
    const expected4 = new Map({step: 'w', remainingCost: 1});
    expect(movement(expected3, {type: events.PREPARE_MOVE, strategy: strategy4})).toEqual(expected4);

    // after two moves, we're done
    expect(movement(expected3, {type: events.PROCESS_VIEW_UPDATE})).toEqual(new Map());
};

export default test;
