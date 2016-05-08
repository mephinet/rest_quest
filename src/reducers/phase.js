import assert from 'assert';
import {Map} from 'immutable';

import events from '../events';
import phases from '../phases';

const phase = (state = new Map({phase: phases.DISCOVER, hasTreasure: false}), action) => {

    switch (action.type) {
    case events.PROCESS_VIEW_UPDATE:
        assert(action.view);
        return state.update('hasTreasure', t => (t || action.view.treasure));

    case events.CALC_PHASE: {
        assert(action.rows);
        const nextPhase =
              state.get('hasTreasure') ? phases.GOHOME :
              action.rows.some(row => row.some(cell => cell && cell.get('treasure'))) ? phases.GOTOTREASURE :
              phases.DISCOVER;

        return state.set('phase', nextPhase);
    }

    default:
        return state;
    }
};

export default phase;
