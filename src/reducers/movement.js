import * as events from '../events';

import {Map} from 'immutable';
import assert from 'assert';

import store from '../store';

import {move} from '../communication';

const movement = (state = new Map(), action) => {
    switch (action.type) {
    case events.UPDATE_VIEW: {
        const lastStep = state.get('step');
        const lastCost = state.get('cost');
        if (!lastStep) {
            // we were not moving
            return state;
        }

        if(lastCost > 1) {
            console.log('Still moving...');
            return state.set('cost', lastCost-1);
        } else {
            console.log('Done moving');
            return state.clear();
        }
    }

    case events.MOVE: {
        const qm = store.getState().getIn(['map', 'qm']);
        const route = qm.getIn(['strategy', 'route']);
        assert(route && route.length > 0, "where to move to?");
        const step = route[0];

        const myPos = qm.get('myPos');
        const rows = qm.get('rows');
        const currentCell = rows.getIn([myPos.get('y'), myPos.get('x')]);
        const nextCell = currentCell.neighbour(step, rows);

        const cost = nextCell.moveCost;

        move(step);
        return state.merge({step, cost});
    }
    default:
        return state;
    }
};

export default movement;
