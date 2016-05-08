import {Map} from 'immutable';
import assert from 'assert';

import {moveCost} from './cost';
import {calcScore} from './score';
import {neighbour} from './neighbour';

export const mergeMaps = (sourceMap, targetMap, myPos = null, offsetX = 0, offsetY = 0) => {
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
                             moveCost: moveCost(c.type, c.enemyCastle),
                             myCell: (myPos && myPos.x === (offsetX+x) && myPos.y === (offsetY+y))
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
            c.cumulatedCost = c.route = c.visibilityGain = undefined;
            c.routed = false;
        }
    }));

    currentCell.cumulatedCost = 0;
    currentCell.route = '';
};

export const findBestCell = (rows, myCastlePos, predicate) => {
    let highscore = 0;
    let highscoreCell = null;
    rows.forEach(row => row.forEach(c => {
        if (c) {
            const score = c.score = calcScore(c, myCastlePos);
            if (predicate(c) && score > highscore) {
                highscore = score;
                highscoreCell = c;
            }
        }
    }));
    assert(highscoreCell, 'no highscoreCell found');
    return highscoreCell;
};

export const markRoute = (rows, currentCell, route) => {
    currentCell.routed = true;

    let nextCell = currentCell;
    while (route) {
        nextCell = neighbour(route[0], nextCell.position, rows);
        nextCell.routed = true;
        route = route.slice(1);
    }
};
