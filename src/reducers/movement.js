import * as events from '../events';

import {Map} from 'immutable';
import assert from 'assert';

import store from '../store';

const movement = (state = new Map(), action) => {
    switch (action.type) {
    case events.MOVE: {
        const qm = store.getState().getIn(['map', 'qm']);
        const route = qm.getIn(['strategy', 'route']);
        assert(route && route.length > 0, "where to move to?");
        const step = route[0];

        const myPos = qm.get('myPos');
        const rows = qm.get('rows');
        const currentCell = rows.get(myPos.get('y')).get(myPos.get('x'));
        const nextCell = currentCell.neighbour(step, rows);

        const cost = nextCell.moveCost;
        return state.merge({step, cost});
    }
    default:
        return state;
    }
};

export default movement;
