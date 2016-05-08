import {Map} from 'immutable';
import assert from 'assert';

import {moveCost} from './cost';
import {calcScore} from './score';

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

export const resetCells = (rows, currentCell) => {
    rows.forEach(row => row.forEach(c => {
        if (c) {
            c.cumulatedCost = c.route = c.visibilityGain = c.score = undefined;
        }
    }));

    currentCell.cumulatedCost = 0;
    currentCell.route = '';
};

export const findBestCell = (rows, myCastlePos) => {
    let highscore = 0;
    let highscoreCell = null;
    rows.forEach(row => row.forEach(c => {
        if (c) {
            const score = calcScore(c, myCastlePos);
            if (score > highscore) {
                highscore = score;
                highscoreCell = c;
            }
        }
    }));
    assert(highscoreCell, 'no highscoreCell found');
    return highscoreCell;
};
