import request from 'request';

import store from './store';

import * as events from './events';

export const reset = (baseurl) => {
    request({url: baseurl + '/reset/', method: 'GET'},
            (error, response, body) => {
                if(error) {
                    console.error('reset failed: ' + body);
                } else {
                    console.log('server reset ok: ' + body);
                }
            });
};

export const login = (baseurl, username) => {
    request({url: baseurl + '/register/', method: 'POST', form: {name: username}},
            (error, response, body) => {
                if(error) {
                    console.log(body);
                } else {
                    const data = JSON.parse(body);
                    if (data.error) {
                        console.error('Server returned error: ' + data.error);
                    } else {
                        console.log('successfully registered.');
                        store.dispatch({type: events.UPDATE_VIEW, view: JSON.parse(body)});
                    }
                }
            });
};
