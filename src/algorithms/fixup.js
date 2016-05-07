import {maxCost} from '../consts';

const reverse = dir => { return {n: 's', s: 'n', e: 'w', w: 'e'}[dir]; };

const fixup = rows => {
    let modified = 0;
    rows.forEach(row => row.forEach(c => {
        if (c !== undefined) {
            const directNeighbours = c.directNeighbours(rows);
            let minNeighbourDir;
            let minNeighbourCC = 10*maxCost;
            Object.keys(directNeighbours).forEach(d => {
                const cc = directNeighbours[d] !== undefined ? directNeighbours[d].cumulatedCost : 10*maxCost;
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

export default fixup;
