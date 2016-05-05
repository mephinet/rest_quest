import store from '../store';

const max = 100000;

class Cell {

    constructor ({data, position}) {
        this.type = data.type;
        this.position = position;
        this.treasure = data.treasure;

        const username = store.getState().get('config').get('username');
        this.myCastle = data.castle ? data.castle === username : false;
        this.enemyCastle = data.castle ? data.castle !== username : false;

        this.moveCost = this.calcMoveCost(this.type, this.enemyCastle);
        this.cumulatedCost = undefined;
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
        return rows.get(this.position.y).get(this.position.x-1);
    }

    neighbourEast(rows) {
        return rows.get(this.position.y).get(this.position.x+1);
    }

    neighbourNorth(rows) {
        const row = rows.get(this.position.y-1);
        return row ? row.get(this.position.x) : null;
    }

    neighbourSouth(rows) {
        const row = rows.get(this.position.y+1);
        return row ? row.get(this.position.x) : null;
    }

    directNeighbours(rows) {
        return [this.neighbourWest(rows), this.neighbourNorth(rows), this.neighbourEast(rows), this.neighbourSouth(rows)];
    }
}

export default Cell;
