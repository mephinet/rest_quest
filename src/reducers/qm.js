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
        if (n1.cumulatedCost <= n2.cumulatedCost) {
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

const qm = (state = new Map({rows: null, myPos: null, strategy: null}), action) => {

    switch(action.type) {
    case events.UPDATE_VIEW: {
        console.time('qm.UPDATE_VIEW');

        let rows;
        if (!state.get('rows')) {
            // initialize 20x20, center received data
            rows = [...Array(20)].map(() => [...Array(20)].map(() => undefined));

        } else {
            // XX initialize rows from state
            rows = [...Array(20)].map(() => [...Array(20)].map(() => undefined));
        }
        // XXX calc offset!
        const offsetX = 8;
        const offsetY = 8;

        let myCastlePos = null;
        const data = action.view;
        data.forEach(
            (row, y) => row.forEach(
                (column, x) => {
                    const c = new Cell({data: column, position: {x: offsetX+x, y: offsetY+y}});
                    if (c.myCastle) {
                        assert(myCastlePos === null, 'o-oh, wrap detected - handle me please');
                        myCastlePos = c.position;
                    }
                    rows[offsetY+y][offsetX+x] = c;
                })
        );
        assert(myCastlePos !== null, 'castle not found :(');

        const currentCell = rows[offsetY + (data.length-1)/2][offsetX + (data[0].length-1)/2];
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

        console.timeEnd('qm.UPDATE_VIEW');

        const step = highscoreCell.route[0];
        const nextCell = currentCell.neighbour(step, rows);

        return state.set('rows', new List(rows.map(
            row => List(row.map(
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
            .set('nextPos', new Map({cost: nextCell.moveCost, x: nextCell.position.x, y: nextCell.position.y}))
            .set('strategy', new Map({highscore: highscore, route: highscoreCell.route}));
    }
    default:
        return state;
    }

};

export default qm;
