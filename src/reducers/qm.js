import {Map, List} from 'immutable';
import assert from 'assert';

import * as events from '../events';
import * as consts from '../consts';

import expand from '../algorithms/expand';
import fixup from '../algorithms/fixup';

import Cell from '../components/Cell';

const qm = (state = new Map({rows: null, myPos: null, nextPos: null, strategy: new Map()}), action) => {

    switch(action.type) {
    case events.UPDATE_VIEW: {
        // build empty array with initial size
        const initialMapSize = action.initialMapSize || consts.initialMapSize;
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
