export const max = 100000;

const range = (start, end) => [...Array(end - start + 1)].map((_, i) => start + i);

export class Cell {

    constructor ({type, position, treasure, myCastle, enemyCastle}) {
        this.type = type;
        this.position = position;
        this.treasure = treasure;
        this.myCastle = myCastle;
        this.enemyCastle = enemyCastle;

        this.moveCost = this.calcMoveCost(this.type, this.enemyCastle);
        this.cumulatedCost = undefined;
        this.route = undefined;
        this.visibilityGain = undefined;
        this.score = undefined;
    }

    calcMoveCost(type, enemyCastle) {
        if(enemyCastle) {
            return max;
        }

        switch (type) {
        case 'water':
            return max;
        case 'mountain':
            return 2;
        default:
            return 1;
        }
    }

    calcVisibilityGain(rows) {
        const viewOneDir = {forest: 1, grass: 2, mountain: 3, water: 0}[this.type];

        const rowIds = range(this.position.y - viewOneDir, this.position.y + viewOneDir);
        const colIds = range(this.position.x - viewOneDir, this.position.x + viewOneDir);

        let gain = 0;
        rowIds.map(rowId => {
            if ((rowId < 0) || (rowId > rows.length-1)) {
                gain += colIds.length;
            } else {
                const row = rows[rowId];
                colIds.map(colId => {
                    if ((colId < 0) || (colId > row.length-1)) {
                        gain += 1;
                    } else {
                        gain += (row[colId] === undefined);
                    }
                });
            }
        });
        return this.visibilityGain = gain;
    }

    calcManhattan(other) {
        return Math.abs(other.x - this.position.x) + Math.abs(other.y - this.position.y);
    }

    calcScore(myCastlePos) {
        if (this.cumulatedCost === 0) {
            return this.score = 0;
        }
        const distanceToHome = this.calcManhattan(myCastlePos);
        return this.score = this.visibilityGain / (this.cumulatedCost + distanceToHome);
    }

    setCumulatedCost(cost) {
        this.cumulatedCost = cost;
    }

    setRoute(r) {
        this.route = r;
    }

    calcCumulatedCost(costUntilHere) {
        // check if we already have a cumulatedCost - if so, only updated if lower!
        const newCost = costUntilHere + this.moveCost;

        if (this.cumulatedCost !== undefined && this.cumulatedCost < newCost) {
            return false;
        }
        this.cumulatedCost = newCost;
        return true;
    }

    neighbourWest(rows) {
        if (this.position.x === 0) return;
        return rows[this.position.y][this.position.x-1];
    }

    neighbourEast(rows) {
        const row = rows[this.position.y];
        if (this.position.x >= row.length-1) return;
        return row[this.position.x+1];
    }

    neighbourNorth(rows) {
        if (this.position.y === 0) return;
        return rows[this.position.y-1][this.position.x];
    }

    neighbourSouth(rows) {
        if (this.position.y >= rows.length-1) return;
        return rows[this.position.y+1][this.position.x];
    }

    neighbour(dir, rows) {
        return ({w: this.neighbourWest, n: this.neighbourNorth, e: this.neighbourEast, s: this.neighbourSouth}[dir]).call(this, rows);
    }

    directNeighbours(rows) {
        return {
            w: this.neighbourWest(rows),
            n: this.neighbourNorth(rows),
            e: this.neighbourEast(rows),
            s: this.neighbourSouth(rows)
        };
    }
}

export default Cell;
