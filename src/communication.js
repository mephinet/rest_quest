import request from 'request';

import store from './store';

import * as events from './events';

export const reset = () => {
    const baseurl = store.getState().get('config').get('baseurl');
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
    const baseurl = store.getState().get('config').get('baseurl');
    const name = store.getState().get('config').get('username');
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
                        store.dispatch({type: events.UPDATE_VIEW, view: JSON.parse(body)});
                        store.dispatch({type: events.MOVE});
                    }
                }
            });
};

export const move = (direction) => {
    const baseurl = store.getState().get('config').get('baseurl');
    const name = store.getState().get('config').get('username');
    request({url: baseurl + '/move/', method: 'POST', form: {name, direction}},
            (error, response, body) => {
                if(error) {
                    console.error('move failed' + body);
                    process.exit(1);
                } else {
                    console.log('successfully moved.');
                }
            });
};
