import {List} from 'immutable';

import Cell from '../components/Cell';

class QuestMap {

    constructor() {
        this.rows = null;
        this.myPos = undefined;
    }

    processUpdateFromServer(data) {
        console.log('Received map ' + data.length + 'x' + data[0].length);

        const rows = List(data.map(row => {
            return List(row.map(column => {
                return new Cell({data: column});
            }));
        }));

        this.rows = rows;
        this.myPos = [((data[0].length-1)/2), ((data.length-1)/2)];
    }
}

export default QuestMap;
