import {Map, List} from 'immutable';
import assert from 'assert';

import * as events from '../events';

import {Cell, max} from '../components/Cell';

const expand = (cell, rows, movement1, movement2, direction1, direction2) => {
    if (cell === undefined) {
        return;
    }

    const n1 = movement1(cell, rows);
    if (n1 !== undefined) {
        if (n1.calcCumulatedCost(cell.cumulatedCost)) {
            // if equal CC, make clever choice here
            n1.setRoute(cell.route + direction1);
        }
    }

    const n2 = movement2(cell, rows);
    if (n2 !== undefined) {
        if (n2.calcCumulatedCost(cell.cumulatedCost)) {
            // if equal CC, make clever choice here
            n2.setRoute(cell.route + direction2);
        }
    }

    const n12 = n1 !== undefined ? movement2(n1, rows) :
          n2 !== undefined ? movement1(n2, rows) :
          undefined;
    if (n12 !== undefined) {
        if (n1 !== undefined && (n2 === undefined || n1.cumulatedCost <= n2.cumulatedCost)) {
            if (n12.calcCumulatedCost(n1.cumulatedCost)) {
                // if equal CC, make clever choice here
                n12.setRoute(cell.route + direction1 + direction2);
            }
        } else {
            if (n12.calcCumulatedCost(n2.cumulatedCost)) {
                // if equal CC, make clever choice here
                n12.setRoute(cell.route + direction2 + direction1);
            }
        }
    }

    if (n1 !== undefined) expand(n1, rows, movement1, movement2, direction1, direction2);
    if (n2 !== undefined) expand(n2, rows, movement1, movement2, direction1, direction2);
    if (n12 != undefined) expand(n12, rows, movement1, movement2, direction1, direction2);
};

const reverse = dir => { return {n: 's', s: 'n', e: 'w', w: 'e'}[dir]; };

const fixup = rows => {
    let modified = 0;
    rows.forEach(row => row.forEach(c => {
        if (c !== undefined) {
            const directNeighbours = c.directNeighbours(rows);
            let minNeighbourDir;
            let minNeighbourCC = 10*max;
            Object.keys(directNeighbours).forEach(d => {
                const cc = directNeighbours[d] !== undefined ? directNeighbours[d].cumulatedCost : 10*max;
                // XXX if there are multiple equally good routes, make a clever choice here
                if (minNeighbourCC > cc) {
                    minNeighbourDir = d;
                    minNeighbourCC = cc;
                }
            });

            if (c.cumulatedCost > (c.moveCost + minNeighbourCC)) {
                console.warn(`Found non-optimal route at ${c.route} - shorter route via ${minNeighbourDir}. Optimizing...`);

                c.calcCumulatedCost(minNeighbourCC);
                c.setRoute(directNeighbours[minNeighbourDir].route + reverse(minNeighbourDir));
                modified++;
            }
        }
    }));
    return modified;
};

const qm = (state = new Map({rows: null, myPos: null, nextPos: null, strategy: new Map()}), action) => {

    switch(action.type) {
    case events.UPDATE_VIEW: {
        // build empty array with initial size
        const initialMapSize = action.initialMapSize || 15;
        const rows = [...Array(initialMapSize)].map(() => [...Array(initialMapSize)].map(() => undefined));
        const data = action.view;
        const stepDone = state.getIn(['strategy', 'remainingStepCost']) === 0;
        const initial = !state.get('rows');

        let offsetX, offsetY, myPos, myCastlePos;
        if (initial) {
            offsetX = offsetY = Math.round((initialMapSize-data.length)/2);
            myPos = {x: (offsetX + (data[0].length-1)/2),
                     y: (offsetY + (data.length-1)/2)
                    };
        } else {
            // populate array with state
            state.get('rows', []).forEach(
                (row, y) => {
                    if(!rows[y]) {
                        rows[y] = [];
                    }
                    row.forEach(
                        (column, x) => {
                            if (column) {
                                const c = rows[y][x] = new Cell({
                                    type: column.get('type'),
                                    position: {x, y},
                                    treasure: column.get('treasure'),
                                    myCastle: column.get('myCastle'),
                                    enemyCastle: column.get('enemyCastle')
                                });

                                if (c.myCastle) {
                                    myCastlePos = c.position;
                                }
                            }
                        }
                    );
                }
            );

            // use old position or old nextPos to calculate offset of received map
            const getPosFrom = stepDone ? 'nextPos' : 'myPos';
            myPos = {x: state.getIn([getPosFrom, 'x']),
                     y: state.getIn([getPosFrom, 'y'])
                    };
            offsetX = myPos.x - (data[0].length-1)/2;
            offsetY = myPos.y - (data.length-1)/2;

            assert(offsetX >= 0 && offsetY >= 0, 'offset is negative, we need to pan the map - NYI');
        }

        const username = action.username;
        assert(username, "can't build map without knowing the username");

        // update array with received data
        data.forEach(
            (row, y) => row.forEach(
                (column, x) => {
                    const c = new Cell({
                        type:        column.type,
                        position:    {x: offsetX+x, y: offsetY+y},
                        treasure:    column.treasure,
                        myCastle:    column.castle ? column.castle === username : false,
                        enemyCastle: column.castle ? column.castle !== username : false
                    });
                    if (c.myCastle) {
                        assert(!myCastlePos || (myCastlePos.x === c.position.x && myCastlePos.y === c.position.y), 'different castle positions in state and view');
                        myCastlePos = c.position;
                    }
                    const oldCell = rows[offsetY+y] ? rows[offsetY+y][offsetX+x] : undefined;
                    assert(!oldCell || oldCell.type === column.type, `cell (${x}/${y}) changed type from ${oldCell && oldCell.type} to ${column.type}`);
                    if (!rows[offsetY+y]) {
                        rows[offsetY+y]= [];
                    }
                    rows[offsetY+y][offsetX+x] = c;
                })
        );
        assert(myCastlePos !== null, 'castle not found :(');

        // calculate cost and gain of every cell
        const currentCell = rows[myPos.y][myPos.x];
        currentCell.setCumulatedCost(0);
        currentCell.setRoute('');

        expand(currentCell, rows, (c, rows) => c.neighbourNorth(rows), (c, rows) => c.neighbourEast(rows), 'n', 'e');
        expand(currentCell, rows, (c, rows) => c.neighbourNorth(rows), (c, rows) => c.neighbourWest(rows), 'n', 'w');
        expand(currentCell, rows, (c, rows) => c.neighbourSouth(rows), (c, rows) => c.neighbourEast(rows), 's', 'e');
        expand(currentCell, rows, (c, rows) => c.neighbourSouth(rows), (c, rows) => c.neighbourWest(rows), 's', 'w');

        do {
            console.log('Performing fixup cycle...');
        } while (fixup(rows));

        rows.forEach(row => row.forEach(c => c !== undefined && c.calcVisibilityGain(rows)));

        // find best cell
        let highscore = 0;
        let highscoreCell = null;
        rows.forEach(row => row.forEach(c => {
            if (c !== undefined) {
                const score = c.calcScore(myCastlePos);
                if (score > highscore) {
                    highscore = score;
                    highscoreCell = c;
                }
            }
        }));

        // decide on new strategy
        let nextStrategy, nextCell;
        if (stepDone || initial) {
            let newRoute = state.getIn(['strategy', 'route'], '').slice(1);

            if (!newRoute) {
                newRoute = highscoreCell.route;
            }

            const step = newRoute[0];
            nextCell = currentCell.neighbour(step, rows);
            nextStrategy = state.get('strategy').merge({route: newRoute, remainingStepCost: nextCell.moveCost});

        } else {
            // nothing to do
            nextStrategy = state.get('strategy');
        }

        let nextState = state.set(
            'rows', new List(rows.map(
                row => new List(row.map(
                    cell => cell ?
                        new Map({type: cell.type,
                                 treasure: cell.treasure,
                                 myCastle: cell.myCastle,
                                 enemyCastle: cell.enemyCastle,
                                 moveCost: cell.moveCost,
                                 cumulatedCost: cell.cumulatedCost,
                                 route: cell.route,
                                 visibilityGain: cell.visibilityGain,
                                 score: cell.score
                                })
                    : null
                ))
            )))
            .set('myPos', new Map(currentCell.position))
            .set('strategy', nextStrategy.set('highscore', highscore));

        if (nextCell) {
            nextState = nextState.merge({nextPos: {cost: nextCell.moveCost, x: nextCell.position.x, y: nextCell.position.y}});
        }

        return nextState;

    }

    case events.PREPARE_MOVE: {
        let nextState = state.updateIn(['strategy', 'remainingStepCost'], c => c-1);
        if (nextState.getIn(['strategy', 'remainingStepCost']) === 0) {
            return nextState.deleteIn('strategy', 'route');
        } else {
            return nextState;
        }
    }

    default:
        return state;
    }

};

export default qm;
