import expect from 'expect';
import {List, Map} from 'immutable';
import deepFreeze from 'deep-freeze';

import qm from '../reducers/qm';
import events from '../events';
import phases from '../phases';

const test = () => {

    const initialState = new Map({rows: null, myPos: null, nextPos: null, myCastlePos: null, strategy: new Map()});
    const phase = new Map({phase: phases.DISCOVER});
    expect(qm(undefined, {}).equals(initialState)).toBe(true);

    expect(qm(initialState, {type: 'unknown'}).equals(initialState)).toBe(true);

    // simple initial state, 3x3, all grass, my castle in center, one montain in the east
    const c = {type: 'grass'};
    const castle = {type: 'grass', castle: 'me'};
    const mountain = {type: 'mountain'};
    const initialView = [[c, c, c],
                         [c, castle, mountain],
                         [c, c, c]];
    deepFreeze(initialView);

    const castleCell = new Map({
        type: "grass",
        myCastle: true,
        enemyCastle: false,
        moveCost: 1,
        position: new Map({x: 3, y: 3})
    });
    
    // first PROCESS_VIEW_UPDATE
    const state1 = qm(initialState, {type: events.PROCESS_VIEW_UPDATE, view: initialView, username: 'me', initialMapSize: 6});

    expect(state1.get('rows')).toBeA(List);
    expect(state1.getIn(['rows', 3])).toBeA(List);
    expect(state1.getIn(['rows', 3, 3]).equals(castleCell)).toBe(true);
    expect(state1.get('myPos').equals(new Map({x: 3, y: 3}))).toBe(true);
    expect(state1.get('myCastlePos').equals(new Map({x: 3, y: 3}))).toBe(true);

    // first CALC_STRATEGY
    const state2 = qm(state1, {type: events.CALC_STRATEGY, phase});
    expect(state2.get('nextPos').equals(new Map({cost: 2, x: 4, y: 3}))).toBe(true);
    expect(state2.get('strategy').equals(new Map({route: 'e', remainingStepCost: 2}))).toBe(true);
    
    // first PREPARE_MOVE, reduce remaining steps to 1
    const expected3 = state2.setIn(['strategy', 'remainingStepCost'], 1);
    const state3 = qm(state2, {type: events.PREPARE_MOVE});
    expect(state3.equals(expected3)).toBe(true);

    // second PROCESS_VIEW_UPDATE, no changes
    const state4 = qm(state3, {type: events.PROCESS_VIEW_UPDATE, view: initialView, username: 'me', initialMapSize: 6});
    expect(state4.equals(expected3)).toBe(true);

    // second CALC_STRATEGY, no changes
    const expected5 = state4;
    const state5 = qm(state4, {type: events.CALC_STRATEGY, phase});
    expect(state5.equals(expected5)).toBe(true);
    
    // second PREPARE_MOVE, reduce remaining steps to 0
    const expected6 = state5.setIn(['strategy', 'remainingStepCost'], 0);
    const state6 = qm(state5, {type: events.PREPARE_MOVE});
    expect(state6.equals(expected6)).toBe(true);

    // third PROCESS_VIEW_UPDATE, now we're on top of the mountain and see another mountain south-east
    const viewFromTheMountain = [[c,      c,        c       ],
                                 [castle, mountain, c       ],
                                 [c,      c       , mountain]
                                ];
    deepFreeze(viewFromTheMountain);

    const state9 = qm(state6, {type: events.PROCESS_VIEW_UPDATE, view: viewFromTheMountain, username: 'me', initialMapSize: 6});
    expect(state9.getIn(['rows', 3, 3, 'myCastle'])).toBe(true);
    expect(state9.getIn(['rows', 3, 4, 'type'])).toEqual('mountain');
    expect(state9.getIn(['rows', 3, 5, 'type'])).toEqual('grass');
    expect(state9.getIn(['rows', 4, 5, 'type'])).toEqual('mountain');
    expect(state9.get('myPos').equals(new Map({x: 4, y: 3}))).toBe(true);
};

export default test;
