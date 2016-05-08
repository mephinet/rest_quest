import {maxCost} from '../consts';

import {directNeighbours} from './neighbour';
import {setRouteIfShorter} from './routes';

const reverse = dir => { return {n: 's', s: 'n', e: 'w', w: 'e'}[dir]; };

const fixup = rows => {
    let modified = 0;
    rows.forEach(row => row.forEach(c => {
        if (c) {
            const neighbours = directNeighbours(c.position, rows);
            let minNeighbourDir;
            let minNeighbourCC = 10*maxCost;
            Object.keys(neighbours).forEach(d => {
                const cc = neighbours[d] ? neighbours[d].cumulatedCost : 10*maxCost;
                // XXX if there are multiple equally good routes, make a clever choice here
                if (minNeighbourCC > cc) {
                    minNeighbourDir = d;
                    minNeighbourCC = cc;
                }
            });

            if (c.cumulatedCost > (c.moveCost + minNeighbourCC)) {
                console.warn(`Found non-optimal route at ${c.route} - shorter route via ${minNeighbourDir}. Optimizing...`);

                setRouteIfShorter(c, neighbours[minNeighbourDir], reverse(minNeighbourDir));
                modified++;
            }
        }
    }));
    return modified;
};

export default fixup;
