
export const calcManhattanDistance = (position1, position2) => {
    return Math.abs(position2.x - position1.x) + Math.abs(position2.y - position1.y);
};

export const calcScore = (cell, myCastlePos) => {
    if (cell.myCell) {
        return cell.score = 0;
    }
    const distanceToHome = calcManhattanDistance(cell.position, myCastlePos);
    return cell.score = cell.visibilityGain / (cell.cumulatedCost + distanceToHome);
};
