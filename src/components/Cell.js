import store from '../store';

export const max = 100000;

export class Cell {

    constructor ({data, position}) {
        this.type = data.type;
        this.position = position;
        this.treasure = data.treasure;

        const username = store.getState().get('config').get('username');
        this.myCastle = data.castle ? data.castle === username : false;
        this.enemyCastle = data.castle ? data.castle !== username : false;

        this.moveCost = this.calcMoveCost(this.type, this.enemyCastle);
        this.cumulatedCost = undefined;
        this.route = undefined;
    }

    calcMoveCost(type, enemyCastle) {
        if(enemyCastle) {
            return max;
        }

        switch (type) {
        case 'mountain':
            return 2;
        case 'water':
            return max;
        default:
            return 1;
        }
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
        return rows.get(this.position.y).get(this.position.x-1);
    }

    neighbourEast(rows) {
        const row = rows.get(this.position.y);
        if (this.position.x >= row.size-1) return;
        return row.get(this.position.x+1);
    }

    neighbourNorth(rows) {
        if (this.position.y === 0) return;
        const row = rows.get(this.position.y-1);
        return row.get(this.position.x);
    }

    neighbourSouth(rows) {
        if (this.position.y >= rows.size-1) return;
        const row = rows.get(this.position.y+1);
        return row.get(this.position.x);
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
