import * as events from '../events';
import * as phases from '../phases';

const phase = (state = phases.DISCOVER, action) => {

    switch (action.type) {
    case events.UPDATE_VIEW:
        if (action.view.treasure) {
            return phases.GOHOME;
        } else if (action.view.view.some(row => row.some(tile => tile.treasure))) {
            return phases.GOTOTREASURE;
        } else {
            return phases.DISCOVER;
        }
    default:
        return state;
    }
};

export default phase;