import {Map, List} from 'immutable';

import * as events from '../events';

import Cell from '../components/Cell';

const qm = (state = new Map({rows: null, myPos: undefined}), action) => {

    switch(action.type) {
    case events.UPDATE_VIEW: {
        const data = action.view.view;
        const rows = List(data.map((row, y) => {
            return List(row.map((column, x) => {
                return new Cell({data: column, position: {x, y}});
            }));
        }));

        let currentCell = rows.get((data.length-1)/2).get((data[0].length-1)/2);
        currentCell.setCumulatedCost(0);

        let success;
        do {
            const oneUp = above(rows, currentCell);
            success = oneUp.calcCumulatedCost(currentCell.cumulatedCost);
            currentCell = oneUp;
        } while (success);

        return state.set('rows', rows).set('myPos', [((data[0].length-1)/2), ((data.length-1)/2)]);
    }
    default:
        return state;
    }

};

const above = (rows, cell) => rows.get(cell.position.y-1).get(cell.position.x);

export default qm;
