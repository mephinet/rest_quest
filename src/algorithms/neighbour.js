export const neighbourWest = (position, rows) => {
    if (position.x === 0) return;
    return rows[position.y][position.x-1];
};

export const neighbourEast = (position, rows) => {
    const row = rows[position.y];
    if (position.x >= row.length-1) return;
    return row[position.x+1];
};

export const neighbourNorth = (position, rows) => {
    if (position.y === 0) return;
    return rows[position.y-1][position.x];
};

export const neighbourSouth = (position, rows) => {
    if (position.y >= rows.length-1) return;
    return rows[position.y+1][position.x];
};

export const neighbour = (dir, position, rows) => {
    return {w: neighbourWest, n: neighbourNorth, e: neighbourEast, s: neighbourSouth}[dir](position, rows);
};

export const directNeighbours = (position, rows)  => {
    return {
        w: neighbourWest(position, rows),
        n: neighbourNorth(position, rows),
        e: neighbourEast(position, rows),
        s: neighbourSouth(position, rows)
    };
};
