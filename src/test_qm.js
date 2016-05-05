import expect from 'expect';
import {List, Map, fromJS} from 'immutable';

import store from './store';
import qm from './reducers/qm';
import * as events from './events';

const test = () => {

    const initialState = new Map({rows: null, myPos: null, strategy: null});
    expect(qm(undefined, {})).toEqual(initialState);

    expect(qm(initialState, {type: 'unknown'})).toEqual(initialState);

    store.dispatch({type: events.UPDATE_CONFIG, config: {username: 'me'}});

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

    const newState = qm(initialState, {type: events.UPDATE_VIEW, view: initialView});

    expect(newState.get('rows')).toBeA(List);
    expect(newState.getIn(['rows', 1])).toBeA(List);
    expect(newState.getIn(['rows', 1, 1])).toBeA(Map);
    expect(newState.getIn(['rows', 1, 1])).toEqual(castleCell);
    expect(newState.get('myPos')).toEqual(fromJS({x: 1, y: 1}));
    expect(newState.getIn(['strategy', 'route'])).toEqual('e');
};

export default test;
