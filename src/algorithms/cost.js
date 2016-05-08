import {maxCost} from '../consts';

export const moveCost = (type, enemyCastle) => {
    if(enemyCastle) {
        return maxCost;
    }

    switch (type) {
    case 'water':
        return maxCost;
    case 'mountain':
        return 2;
    default:
        return 1;
    }
};
