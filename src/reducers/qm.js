import assert from 'assert';
import {Map} from 'immutable';

import events from '../events';
import phases from '../phases';
import * as consts from '../consts';

import {mergeMaps} from '../algorithms/map';
import {calcVisibilityGain} from '../algorithms/visibility';
import {calcStrategy} from '../algorithms/routes';


const qm = (state = new Map({rows: null, myPos: null, nextPos: null, myCastlePos: null, strategy: new Map()}), action) => {

    switch(action.type) {
    case events.PROCESS_VIEW_UPDATE: {
        assert(action.view, 'view required');

        // build empty array with initial size
        const initialMapSize = action.initialMapSize || consts.initialMapSize;
        let rows = [...Array(initialMapSize)].map(() => [...Array(initialMapSize)].map(() => undefined));

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

        let offsetX, offsetY, myPos, myCastlePos, nextPos;
        if (initial) {
            offsetX = offsetY = Math.round((initialMapSize-data.length)/2);
            myPos = myCastlePos =
                {x: (offsetX + (data[0].length-1)/2),
                 y: (offsetY + (data.length-1)/2)
                };
        } else {

            // merge state into freshly initialized 'rows'
            mergeMaps(state.get('rows'), rows);

            // use old position or old nextPos to calculate offset of received map
            const stepDone = state.getIn(['strategy', 'remainingStepCost']) === 0;
            nextPos = state.get('nextPos').toJS();
            myPos = stepDone ? {x: nextPos.x, y: nextPos.y} : state.get('myPos').toJS();
            myCastlePos = state.get('myCastlePos').toJS();

            offsetX = myPos.x - (data[0].length-1)/2;
            offsetY = myPos.y - (data.length-1)/2;

            if (offsetX < 0) {
                console.log(`Adding ${-offsetX} column(s) on the left`);
                rows = rows.map(r => [...Array(-offsetX)].concat(r));
                rows.forEach(r => r.forEach(cell => {
                    if (cell) {
                        cell.position.x -= offsetX;
                    }
                }));
                myPos.x -= offsetX;
                myCastlePos.x -= offsetX;
                nextPos.x -= offsetX;
                offsetX = 0;
            }
            if (offsetY < 0) {
                console.log(`Adding ${-offsetY} row(s) on the top`);
                rows = [...Array(-offsetY)].map(() => []).concat(rows);
                rows.forEach(r => r.forEach(cell => {
                    if(cell) {
                        cell.position.y -= offsetY;
                    }
                }));
                myPos.y -= offsetY;
                myCastlePos.y -= offsetY;
                nextPos.y -= offsetY;
                offsetY = 0;
            }
        }

        // update 'rows' with received data
        mergeMaps(data, rows, myPos, offsetX, offsetY);

        // XXX check if we have more than one myCastle to detect wrap

        const update = {rows, myPos, myCastlePos, nextPos};
        return state.merge(update);
    }

    case events.CALC_STRATEGY : {
        assert(action.phase, 'phase required');

        const stepDone = state.getIn(['strategy', 'remainingStepCost']) === 0;
        const oldRoute = state.getIn(['strategy', 'route'], '');
        const rows = state.get('rows').toJS();
        const myPos = state.get('myPos').toJS();
        assert(rows && myPos, 'state incomplete');

        const myCastlePos = state.get('myCastlePos').toJS();
        const currentCell = rows[myPos.y][myPos.x];

        switch(action.phase.get('phase')) {
        case phases.DISCOVER: {

            const initial = !oldRoute;
            if (!(initial || stepDone)) {
                return state;
            }

            const {route, nextCell} = calcStrategy(rows, currentCell, myCastlePos, oldRoute, c => calcVisibilityGain(c, rows));
            return state.merge({strategy: {route, remainingStepCost: nextCell.moveCost},
                                nextPos: Object.assign({cost: nextCell.moveCost}, nextCell.position),
                                rows: rows
                               });
        }

        case phases.GOTOTREASURE: {

            if (!stepDone) {
                return state;
            }

            // don't pass oldRoute so that map gets re-evaluated every time
            const {route, nextCell} = calcStrategy(rows, currentCell, myCastlePos, '', c => c.treasure ? 100 : 0, c => c.treasure);

            return state.merge({strategy: {route, remainingStepCost: nextCell.moveCost},
                                nextPos: Object.assign({cost: nextCell.moveCost}, nextCell.position),
                                rows
                               });

        }

        case phases.GOHOME : {
            if (!stepDone) {
                return state;
            }
            const {route, nextCell} = calcStrategy(rows, currentCell, myCastlePos, oldRoute, c => c.myCastle ? 100 : 0, c => c.myCastle);

            return state.merge({strategy: {route, remainingStepCost: nextCell.moveCost},
                                nextPos: Object.assign({cost: nextCell.moveCost}, nextCell.position),
                                rows
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
