import expect from 'expect';
import {List, Map} from 'immutable';

import qm from './reducers/qm';
import * as events from './events';

const test = () => {

    const initialState = new Map({rows: null, myPos: null, nextPos: null, strategy: new Map()});
    expect(qm(undefined, {})).toEqual(initialState);

    expect(qm(initialState, {type: 'unknown'})).toEqual(initialState);

    // simple initial state, 3x3, all grass, my castle in center, one montain in the east
    const c = {type: 'grass'};
    const castle = {type: 'grass', castle: 'me'};
    const mountain = {type: 'mountain'};
    const initialView = [[c, c, c],
                         [c, castle, mountain],
                         [c, c, c]];

    const castleCell = new Map({
        enemyCastle: false,
        myCastle: true,
        route: "",
        treasure: undefined,
        visibilityGain: 16,
        cumulatedCost: 0,
        score: 0,
        type: "grass",
        moveCost: 1
    });

    const newState = qm(initialState, {type: events.UPDATE_VIEW, view: initialView, username: 'me', initialMapSize: 6});

    expect(newState.get('rows')).toBeA(List);
    expect(newState.getIn(['rows', 3])).toBeA(List);
    expect(newState.getIn(['rows', 3, 3])).toBeA(Map);
    expect(newState.getIn(['rows', 3, 3])).toEqual(castleCell);
    expect(newState.get('myPos')).toEqual(new Map({x: 3, y: 3}));
    expect(newState.get('nextPos')).toEqual(new Map({cost: 2, x: 4, y: 3}));
    expect(newState.get('strategy')).toEqual(new Map({route: 'e', remainingStepCost: 2, highscore: 40/3}));

    // first PREPARE_MOVE, reduce remaining steps to 1
    const expected2 = newState.setIn(['strategy', 'remainingStepCost'], 1);
    expect(qm(newState, {type: events.PREPARE_MOVE})).toEqual(expected2);

    // first UPDATE_VIEW, no changes
    expect(qm(expected2, {type: events.UPDATE_VIEW, view: initialView, username: 'me', initialMapSize: 6})).toEqual(expected2);

    // second PREPARE_MOVE, reduce remaining steps to 0
    const expected3 = expected2.setIn(['strategy', 'remainingStepCost'], 0);
    expect(qm(expected2, {type: events.PREPARE_MOVE})).toEqual(expected3);

    // second UPDATE_VIEW, now we're on top of the mountain and see another mountain south-east
    const viewFromTheMountain = [[c,      c,        c       ],
                                 [castle, mountain, c       ],
                                 [c,      c       , mountain]
                                ];

    const nextState = qm(expected3, {type: events.UPDATE_VIEW, view: viewFromTheMountain, username: 'me', initialMapSize: 6});
    expect(nextState.getIn(['rows', 3, 3, 'myCastle'])).toBe(true);
    expect(nextState.getIn(['rows', 3, 4, 'type'])).toEqual('mountain');
    expect(nextState.getIn(['rows', 3, 5, 'type'])).toEqual('grass');
    expect(nextState.getIn(['rows', 4, 5, 'type'])).toEqual('mountain');
    expect(nextState.get('myPos')).toEqual(new Map({x: 4, y: 3}));
};

export default test;
