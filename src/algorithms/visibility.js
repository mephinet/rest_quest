import {visibility} from '../consts';

const range = (start, end) => [...Array(end - start + 1)].map((_, i) => start + i);

export const setVisibilityGain = (cell, rows) => {
    const viewOneDir = visibility[cell.type];

    const rowIds = range(cell.position.y - viewOneDir, cell.position.y + viewOneDir);
    const colIds = range(cell.position.x - viewOneDir, cell.position.x + viewOneDir);

    let gain = 0;
    rowIds.map(rowId => {
        if ((rowId < 0) || (rowId > rows.length-1)) {
            gain += colIds.length;
        } else {
            const row = rows[rowId];
            colIds.map(colId => {
                if ((colId < 0) || (colId > row.length-1)) {
                    gain += 1;
                } else {
                    gain += (!row[colId]);
                }
            });
        }
    });
    return cell.visibilityGain = gain;
};
