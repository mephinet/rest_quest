import {Map} from 'immutable';
import assert from 'assert';

import events from '../events';

const movement = (state = new Map(), action) => {
    switch (action.type) {
    case events.PROCESS_VIEW_UPDATE: {
        const lastStep = state.get('step');
        const remainingCost = state.get('remainingCost');
        if (!lastStep) {
            // we were not moving
            return state;
        }

        if(remainingCost > 1) {
            console.log('Still moving...');
            return state.update('remainingCost', c => c-1);
        } else {
            console.log('Done moving');
            return state.clear();
        }
    }

    case events.PREPARE_MOVE: {
        assert(action.strategy);
        const lastStep = state.get('step');
        if (lastStep) {
            console.log(`Still going ${lastStep}`);
            return state;
        }

        const route = action.strategy.get('route');
        assert(route && route.length > 0, "where to move to?");
        const step = route[0];

        const remainingCost = action.strategy.get('remainingCost');

        return state.merge({step, remainingCost});
    }
    default:
        return state;
    }
};

export default movement;
