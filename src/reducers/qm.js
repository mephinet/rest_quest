import {Map, List} from 'immutable';

import * as events from '../events';

import Cell from '../components/Cell';

const expand = (cell, rows, movement1, movement2, direction1, direction2) => {
    if (cell === undefined) {
        return;
    }

    const n1 = movement1(cell, rows);
    if (n1 !== undefined) {
        if (n1.calcCumulatedCost(cell.cumulatedCost)) {
            n1.setRoute(cell.route + direction1);
        }
    }

    const n2 = movement2(cell, rows);
    if (n2 !== undefined) {
        if (n2.calcCumulatedCost(cell.cumulatedCost)) {
            n2.setRoute(cell.route + direction2);
        }
    }

    const n12 = n1 !== undefined ? movement2(n1, rows) :
          n2 !== undefined ? movement1(n2, rows) :
          undefined;
    if (n12 !== undefined) {
        if (n1.cumulatedCost <= n2.cumulatedCost) {
            if (n12.calcCumulatedCost(n1.cumulatedCost)) {
                n12.setRoute(cell.route + direction1 + direction2);
            }
        } else {
            if (n12.calcCumulatedCost(n2.cumulatedCost)) {
                n12.setRoute(cell.route + direction2 + direction1);
            }
        }
    }

    if (n1 !== undefined) expand(n1, rows, movement1, movement2, direction1, direction2);
    if (n2 !== undefined) expand(n2, rows, movement1, movement2, direction1, direction2);
    if (n12 != undefined) expand(n12, rows, movement1, movement2, direction1, direction2);
};

const qm = (state = new Map({rows: null, myPos: undefined}), action) => {

    switch(action.type) {
    case events.UPDATE_VIEW: {
        const data = action.view.view;
        const rows = List(data.map((row, y) => {
            return List(row.map((column, x) => {
                return new Cell({data: column, position: {x, y}});
            }));
        }));

        const currentCell = rows.get((data.length-1)/2).get((data[0].length-1)/2);
        currentCell.setCumulatedCost(0);
        currentCell.setRoute('');

        expand(currentCell, rows, (c, rows) => c.neighbourNorth(rows), (c, rows) => c.neighbourEast(rows), 'n', 'e');
        expand(currentCell, rows, (c, rows) => c.neighbourNorth(rows), (c, rows) => c.neighbourWest(rows), 'n', 'w');
        expand(currentCell, rows, (c, rows) => c.neighbourSouth(rows), (c, rows) => c.neighbourEast(rows), 's', 'e');
        expand(currentCell, rows, (c, rows) => c.neighbourSouth(rows), (c, rows) => c.neighbourWest(rows), 's', 'w');

        return state.set('rows', rows).set('myPos', [((data[0].length-1)/2), ((data.length-1)/2)]);
    }
    default:
        return state;
    }

};

export default qm;
