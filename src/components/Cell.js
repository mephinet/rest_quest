import store from '../store';

const max = 100000;

class Cell {

    constructor ({data}) {
        this.type = data.type;
        this.treasure = data.treasure;

        const username = store.getState().get('config').get('username');
        this.myCastle = data.castle ? data.castle === username : false;
        this.enemyCastle = data.castle ? data.castle !== username : false;

        this.cost = this.calcCost(this.type, this.enemyCastle);
    }

    calcCost(type, enemyCastle) {
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
}

export default Cell;
