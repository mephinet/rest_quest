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

export default expand;
