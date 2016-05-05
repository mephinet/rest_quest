import request from 'request';

import store from './store';

import * as events from './events';

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
                    const data = JSON.parse(body);
                    if (data.error) {
                        console.error('Server returned error: ' + data.error);
                        process.exit(1);
                    } else {
                        console.log('successfully registered.');
                        store.dispatch({type: events.UPDATE_VIEW, view: data});
                        store.dispatch({type: events.MOVE, map: store.getState().get('map')});
                        move(store.getState().getIn(['movement', 'step']));
                    }
                }
            });
};

export const move = (step) => {
    const direction = {n: 'up', s: 'down', w: 'left', e: 'right'}[step];
    const config = store.getState().get('config');
    const baseurl = config.get('baseurl');
    const player = config.get('username');
    request({url: baseurl + '/move/', method: 'POST', form: {player, direction}},
            (error, response, body) => {
                if(error) {
                    console.error('move failed' + body);
                    process.exit(1);
                } else {
                    const data = JSON.parse(body);
                    if (data.error) {
                        console.error('Server returned error: ' + data.error);
                        process.exit(1);
                    } else {
                        console.log('successfully moved.');
                        store.dispatch({type: events.UPDATE_VIEW, view: data});
                    }
                }
            });
};
