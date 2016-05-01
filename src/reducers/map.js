import {Map} from 'immutable';

import QuestMap from '../components/QuestMap';

import * as events from '../events';

const map = (state = Map({qm: new QuestMap()}), action) => {
    switch (action.type) {

    case events.UPDATE_VIEW: {
        console.log('received updated view: ' + JSON.stringify(action.view));

        const qm = state.get('qm');
        qm.processUpdateFromServer(action.view.view);
        return state.set('qm', qm);
    }

    default:
        return state;
    }
};

export default map;
