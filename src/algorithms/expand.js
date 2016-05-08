
import {neighbour} from './neighbour';
import {setRouteIfShorter} from './routes';

const expand = (cell, rows, direction1, direction2) => {
    if (!cell) {
        return;
    }

    const n1 = neighbour(direction1, cell.position, rows);
    if (n1) {
        setRouteIfShorter(n1, cell, direction1);
    }

    const n2 = neighbour(direction2, cell.position, rows);
    if (n2) {
        setRouteIfShorter(n2, cell, direction2);
    }

    const n12 = n1? neighbour(direction2, n1.position, rows) :
          n2 ? neighbour(direction1, n2.position, rows) :
          undefined;

    if (n12) {
        if (n1 && (!n2 || n1.cumulatedCost <= n2.cumulatedCost)) {
            setRouteIfShorter(n12, n1, direction2);
        } else {
            setRouteIfShorter(n12, n2, direction1);
        }
    }

    if (n1) expand(n1, rows, direction1, direction2);
    if (n2) expand(n2, rows, direction1, direction2);
    if (n12) expand(n12, rows, direction1, direction2);
};

export default expand;
