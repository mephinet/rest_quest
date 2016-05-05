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
}

export default Cell;
