import program from 'commander';

import * as events from './events';

import store from './store';
import startServer from './server';

import {reset, login} from './communication';


program
    .version('0.0.1')
    .option('-h, --host [hostname]', 'host [localhost]', 'localhost')
    .option('-p, --port [port]', 'port [3000]', 3000)
    .option('-u, --username [username]', 'username', 'PG')
    .option('-r, --reset', 'reset server')
    .option('-v, --verbose', 'verbose mode')
    .option('-s, --server', 'start websocket server')
    .parse(process.argv);


if (program.verbose) {
    store.subscribe(() => {
        console.log('Current store state: ' + JSON.stringify(store.getState().toJS()));
    });
}

store.dispatch({type: events.UPDATE_CONFIG, config: {username: program.username}});

const main = () => {
    let url = 'http://' + program.host + ':' + program.port;
    if (program.reset) {
        reset(url);
    }
    if (program.server) {
        const io = startServer();
        store.subscribe(() => {
            io.emit('state', store.getState().toJS());
        });
    }
    login(url, program.username);
};


main();
