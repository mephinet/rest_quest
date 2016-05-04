import {Map, List} from 'immutable';

import * as events from '../events';

import Cell from '../components/Cell';

const qm = (state = new Map({rows: null, myPos: undefined}), action) => {

    switch(action.type) {
    case events.UPDATE_VIEW: {
        const data = action.view.view;
        const rows = List(data.map(row => {
            return List(row.map(column => {
                return new Cell({data: column});
            }));
        }));
        return state.set('rows', rows).set('myPos', [((data[0].length-1)/2), ((data.length-1)/2)]);
    }
    default:
        return state;
    }

};

export default qm;
