import {Map} from 'immutable';
import assert from 'assert';

import * as events from '../events';

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
        const lastStep = state.get('step');
        if (lastStep) {
            console.log(`Still going ${lastStep}`);
            return state;
        }

        const qm = action.map.get('qm');
        const route = qm.getIn(['strategy', 'route']);
        assert(route && route.length > 0, "where to move to?");
        const step = route[0];
        const cost = qm.getIn(['nextPos', 'cost']);
        assert(cost && cost > 0, 'no cost found');
        console.log(`Going ${step} (takes ${cost})`);


        return state.merge({step, cost});
    }
    default:
        return state;
    }
};

export default movement;
