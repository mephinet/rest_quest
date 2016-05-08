import {resetCells, findBestCell} from '../algorithms/map';
import {neighbour} from '../algorithms/neighbour';
import expand from '../algorithms/expand';
import fixup from '../algorithms/fixup';


export const setRouteIfShorter = (targetCell, sourceCell, directionToCell) => {
    const newCost = sourceCell.cumulatedCost + targetCell.moveCost;

    if (targetCell.cumulatedCost !== undefined && targetCell.cumulatedCost < newCost) {
        // if equal CC, make clever choice here
        return false;
    }

    targetCell.cumulatedCost = newCost;
    targetCell.route = sourceCell.route + directionToCell;
    return true;
};

export const calcStrategy = (rows, currentCell, myCastlePos, oldRoute, calcVisibility, cellPredicate = () => true) => {
    resetCells(rows, currentCell);

    ['n', 's'].forEach(y => ['e', 'w'].forEach(x => expand(currentCell, rows, y, x)));
    do { true; } while (fixup(rows));

    rows.forEach(row => row.forEach(c => {
        if(c) {
            c.visibilityGain = calcVisibility(c);
        }
    }));

    let route = oldRoute.slice(1);
    if (!route) {
        const highscoreCell = findBestCell(rows, myCastlePos, cellPredicate);
        route = highscoreCell.route;
    }

    const step = route[0];
    const nextCell = neighbour(step, currentCell.position, rows);

    return {route, nextCell};
};
