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
                console.log('we still have steps to do, skipping stategy calculation');
                return state;
            }

            const {route, nextCell} = calcStrategy(rows, currentCell, myCastlePos, oldRoute, c => calcVisibilityGain(c, rows));

            return state.merge({strategy: {route, remainingStepCost: nextCell.moveCost},
                                nextPos: Object.assign({cost: nextCell.moveCost}, nextCell.position),
                                rows: rows
                               });
        }

        case phases.GOTOTREASURE: {
            // XXX if remainingStepCost is 1, do we need to make the
            // next step even if we want to change direction?

            if (!stepDone) {
                // keep climbing
                return state;
            }

            const {route, nextCell} = calcStrategy(rows, currentCell, myCastlePos, oldRoute, c => c.treasure ? 100 : 0, c => c.treasure);

            return state.merge({strategy: {route, remainingStepCost: nextCell.moveCost},
                                nextPos: Object.assign({cost: nextCell.moveCost}, nextCell.position),
                                rows
                               });

        }

        case phases.GOHOME : {
            if (!stepDone) {
                // keep climbing
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
