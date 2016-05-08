import assert from 'assert';
import {Map} from 'immutable';

import events from '../events';
import phases from '../phases';

const phase = (state = new Map({phase: phases.DISCOVER, hasTreasure: false, result: undefined}), action) => {

    switch (action.type) {
    case events.PROCESS_VIEW_UPDATE:
        return state.update('hasTreasure', t => (t || action.treasure));

    case events.CALC_PHASE: {
        assert(action.rows);
        const nextPhase =
              state.get('hasTreasure') ? phases.GOHOME :
              action.rows.some(row => row.some(cell => cell && cell.get('treasure'))) ? phases.GOTOTREASURE :
              phases.DISCOVER;

        return state.set('phase', nextPhase);
    }

    case events.GAME_OVER: {
        assert(action.result);
        return state.set('result', action.result);
    }

    default:
        return state;
    }
};

export default phase;
