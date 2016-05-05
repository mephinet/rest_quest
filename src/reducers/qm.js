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

        currentCell.directNeighbours(rows).map(n => n.calcCumulatedCost(currentCell.cumulatedCost));

        currentCell.neighbourNorth(rows).neighbourNorth(rows).calcCumulatedCost(currentCell.neighbourNorth(rows).cumulatedCost);
        currentCell.neighbourSouth(rows).neighbourSouth(rows).calcCumulatedCost(currentCell.neighbourSouth(rows).cumulatedCost);
        currentCell.neighbourEast(rows).neighbourEast(rows).calcCumulatedCost(currentCell.neighbourEast(rows).cumulatedCost);
        currentCell.neighbourWest(rows).neighbourWest(rows).calcCumulatedCost(currentCell.neighbourWest(rows).cumulatedCost);

        return state.set('rows', rows).set('myPos', [((data[0].length-1)/2), ((data.length-1)/2)]);
    }
    default:
        return state;
    }

};

export default qm;
