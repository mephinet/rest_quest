import assert from 'assert';
import {Map} from 'immutable';

import events from '../events';
import phases from '../phases';
import * as consts from '../consts';

import expand from '../algorithms/expand';
import fixup from '../algorithms/fixup';
import {mergeMaps, resetCells, findBestCell} from '../algorithms/map';
import {neighbour} from '../algorithms/neighbour';
import {setVisibilityGain} from '../algorithms/visibility';


const qm = (state = new Map({rows: null, myPos: null, nextPos: null, myCastlePos: null, strategy: new Map()}), action) => {

    switch(action.type) {
    case events.PROCESS_VIEW_UPDATE: {
        assert(action.view, 'view required');

        // build empty array with initial size
        const initialMapSize = action.initialMapSize || consts.initialMapSize;
        const rows = [...Array(initialMapSize)].map(() => [...Array(initialMapSize)].map(() => undefined));

        const username = action.username;
        assert(username, "can't build map without knowing the username");

        const initial = !state.get('rows');

        // translate castle into myCastle and enemyCastle
        const data = action.view.map(
            row => row.map(
                column => {
                    const c = Object.assign(
                        {myCastle: column.castle ? column.castle === username : false,
                         enemyCastle: column.castle ? column.castle !== username : false
                        },
                        column
                    );
                    delete c.castle;
                    return c;
                }
            )
        );

        let offsetX, offsetY, myPos;
        if (initial) {
            offsetX = offsetY = Math.round((initialMapSize-data.length)/2);
            myPos = {x: (offsetX + (data[0].length-1)/2),
                     y: (offsetY + (data.length-1)/2)
                    };
        } else {

            // merge state into freshly initialized 'rows'
            mergeMaps(state.get('rows'), rows);

            // use old position or old nextPos to calculate offset of received map
            const stepDone = state.getIn(['strategy', 'remainingStepCost']) === 0;
            const getPosFrom = stepDone ? 'nextPos' : 'myPos';
            myPos = {x: state.getIn([getPosFrom, 'x']),
                     y: state.getIn([getPosFrom, 'y'])
                    };

            offsetX = myPos.x - (data[0].length-1)/2;
            offsetY = myPos.y - (data.length-1)/2;

            assert(offsetX >= 0 && offsetY >= 0, 'offset is negative, we need to pan the map - NYI');
        }

        // update 'rows' with received data
        mergeMaps(data, rows, offsetX, offsetY);

        // XXX check if we have more than one myCastle to detect wrap

        const update = {rows: rows, myPos: myPos};
        if (initial) {
            update.myCastlePos = myPos;
        }
        return state.merge(update);
    }

    case events.CALC_STRATEGY : {
        assert(action.phase, 'phase required');

        switch(action.phase.get('phase')) {
        case phases.DISCOVER:
        case phases.GOTOTREASURE: // XXX until implemented
        case phases.GOHOME : { // XXX until implemented
            const oldRoute = state.getIn(['strategy', 'route'], '');
            const stepDone = state.getIn(['strategy', 'remainingStepCost']) === 0;
            const initial = !oldRoute;

            if (!(initial || stepDone)) {
                console.log('we still have steps to do, skipping stategy calculation');
                return state;
            }

            const rows = state.get('rows').toJS();
            const myPos = state.get('myPos').toJS();
            assert(rows && myPos, 'state incomplete');

            const myCastlePos = state.get('myCastlePos').toJS();
            const currentCell = rows[myPos.y][myPos.x];

            resetCells(rows, currentCell);

            ['n', 's'].forEach(y => ['e', 'w'].forEach(x => expand(currentCell, rows, y, x)));
            do { true; } while (fixup(rows));

            rows.forEach(row => row.forEach(c => c && setVisibilityGain(c, rows)));

            let route = oldRoute.slice(1);
            if (!route) {
                const highscoreCell = findBestCell(rows, myCastlePos);
                route = highscoreCell.route;
            }

            const step = route[0];
            const nextCell = neighbour(step, myPos, rows);

            return state.merge({strategy: {route, remainingStepCost: nextCell.moveCost},
                                nextPos: Object.assign({cost: nextCell.moveCost}, nextCell.position),
                                rows: rows
                               });
        }

        default:
            return state;
        }

    }

    case events.PREPARE_MOVE: {
        return state.updateIn(['strategy', 'remainingStepCost'], c => c-1);
    }

    default:
        return state;
    }

};

export default qm;
