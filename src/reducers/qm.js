import {Map, List} from 'immutable';

import * as events from '../events';

import Cell from '../components/Cell';

const expandNE = (cell, rows) => {
    if (cell === undefined) {
        return;
    }
    console.log('in expandeNE for ' + cell.route);

    const n = cell.neighbourNorth(rows);
    if (n !== undefined) {
        if (n.calcCumulatedCost(cell.cumulatedCost)) {
            n.setRoute(cell.route + 'n');
        }
    }

    const e = cell.neighbourEast(rows);
    if (e !== undefined) {
        if (e.calcCumulatedCost(cell.cumulatedCost)) {
            e.setRoute(cell.route + 'e');
        }
    }

    const ne = n !== undefined ? n.neighbourEast(rows) : undefined;
    if (ne !== undefined) {
        if (n.cumulatedCost <= e.cumulatedCost) {
            if (ne.calcCumulatedCost(n.cumulatedCost)) {
                ne.setRoute(cell.route + 'ne');
            }
        } else {
            if (ne.calcCumulatedCost(e.cumulatedCost)) {
                ne.setRoute(cell.route + 'en');
            }
        }
    }

    if (n !== undefined) expandNE(n, rows);
    if (e !== undefined) expandNE(e, rows);
    if (ne != undefined) expandNE(ne, rows);
};

const qm = (state = new Map({rows: null, myPos: undefined}), action) => {

    switch(action.type) {
    case events.UPDATE_VIEW: {
        const data = action.view.view;
        console.log('data is ' + data);
        const rows = List(data.map((row, y) => {
            return List(row.map((column, x) => {
                return new Cell({data: column, position: {x, y}});
            }));
        }));

        const currentCell = rows.get((data.length-1)/2).get((data[0].length-1)/2);
        currentCell.setCumulatedCost(0);
        currentCell.setRoute('');

        expandNE(currentCell, rows);

        return state.set('rows', rows).set('myPos', [((data[0].length-1)/2), ((data.length-1)/2)]);
    }
    default:
        return state;
    }

};

export default qm;
