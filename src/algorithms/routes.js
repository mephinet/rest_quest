
export const setRouteIfShorter = (targetCell, sourceCell, directionToCell) => {
    const newCost = sourceCell.cumulatedCost + targetCell.moveCost;

    if (targetCell.cumulatedCost !== undefined && targetCell.cumulatedCost < newCost) {
        // if equal CC, make clever choice here
        return false;
    }

    targetCell.cumulatedCost = newCost;
    targetCell.route = sourceCell.route + directionToCell;
    return true;
};
