import {Map} from 'immutable';

import events from '../events';

const config = (state = Map(), action) => {
    switch (action.type) {
    case events.UPDATE_CONFIG:
        return state.merge(action.config);
    default:
        return state;
    }
};

export default config;
