import {Map} from 'immutable';

import QuestMap from '../components/QuestMap';

import * as events from '../events';

import phase from './phase';

const map = (state = Map({qm: new QuestMap()}), action) => {
    switch (action.type) {

    case events.UPDATE_VIEW: {
        console.log('received updated view: ' + JSON.stringify(action.view));

        const qm = state.get('qm');
        qm.processUpdateFromServer(action.view.view);
        state = state.set('qm', qm);

        state = state.set('phase', phase(state.get('phase'), action));

        return state;
    }

    default:
        return state;
    }
};

export default map;
