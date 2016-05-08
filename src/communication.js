import request from 'request';
import assert from 'assert';

import store from './store';

import events from './events';

export const reset = () => {
    const baseurl = store.getState().getIn(['config', 'baseurl']);
    request({url: baseurl + '/reset/', method: 'GET'},
            (error, response, body) => {
                if(error) {
                    console.error('reset failed: ' + body);
                    process.exit(1);
                } else {
                    console.log('server reset ok: ' + body);
                }
            });
};

const processResponse = body => {
    const data = JSON.parse(body);
    if (data.error) {
        console.error('Server returned error: ' + data.error);
        process.exit(1);
    } else {
        assert(data.view, body);

        store.dispatch({type: events.PROCESS_VIEW_UPDATE,
                        view: data.view,
                        treasure: data.treasure,
                        username: store.getState().getIn(['config', 'username'])});

        store.dispatch({type: events.CALC_PHASE,
                        rows: store.getState().getIn(['qm', 'rows'])});

        store.dispatch({type: events.CALC_STRATEGY,
                        phase: store.getState().getIn(['phase'])});

        store.dispatch({type: events.PREPARE_MOVE,
                        strategy: store.getState().getIn(["qm", "strategy"])});

        move(store.getState().getIn(['movement', 'step']));
    }
};


export const login = () => {
    const config = store.getState().get('config');
    const baseurl = config.get('baseurl');
    const name = config.get('username');
    request({url: baseurl + '/register/', method: 'POST', form: {name}},
            (error, response, body) => {
                if(error) {
                    console.error(body);
                    process.exit(1);
                } else {
                    processResponse(body);
                }
            });
};

export const move = (step) => {
    const direction = {n: 'up', s: 'down', w: 'left', e: 'right'}[step];
    assert(direction, `Invalid direction: ${step}`);
    const config = store.getState().get('config');
    const baseurl = config.get('baseurl');
    const player = config.get('username');
    console.log(`Sending ${step} to server...`);
    request({url: baseurl + '/move/', method: 'POST', form: {player, direction}},
            (error, response, body) => {
                if(error) {
                    console.error('move failed' + body);
                    process.exit(1);
                } else {
                    processResponse(body);
                }
            });
};
