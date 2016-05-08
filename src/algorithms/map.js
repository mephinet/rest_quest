import {Map} from 'immutable';
import assert from 'assert';

import {moveCost} from './cost';

export const mergeMaps = (sourceMap, targetMap, offsetX = 0, offsetY = 0) => {
    sourceMap.forEach(
        (row, y) => {
            if(!targetMap[offsetY+y]) {
                targetMap[offsetY+y] = [];
            }
            row.forEach(
                (column, x) => {
                    if (column) {
                        const c = Map.isMap(column) ? column.toJS() : column;
                        const oldCell = targetMap[offsetY+y] ? targetMap[offsetY+y][offsetX+x] : undefined;
                        const newCell = Object.assign(
                            {}, // don't modify oldCell
                            oldCell ? oldCell : {},
                            {position: {x: offsetX+x, y: offsetY+y},
                             moveCost: moveCost(c.type, c.enemyCastle)
                            },
                            c);

                        if (oldCell) {
                            assert(oldCell.type === newCell.type, `type of cell (${x}/${y}) changed!`);
                            assert(oldCell.myCastle === newCell.myCastle, `myCastle state of (${x}/${y}) changed: ${oldCell.myCastle} vs ${newCell.myCastle}!`);
                        }

                        targetMap[offsetY+y][offsetX+x] = newCell;
                    }
                }
            );
        }
    );
};
