import {Map} from 'immutable';

import * as events from '../events';

const config = (state = Map(), action) => {
    switch (action.type) {
    case events.UPDATE_CONFIG:
        return state.set('username', action.config.username);
    default:
        return state;
    }
};

export default config;
