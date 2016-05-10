import "babel-polyfill";

import program from 'commander';

import events from './events';

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

const main = () => {
    let url = 'http://' + program.host + ':' + program.port;

    store.dispatch({type: events.UPDATE_CONFIG,
                    config: {username: program.username,
                             baseurl: url
                            }});

    if (program.reset) {
        reset();
    }
    let io;
    if (program.server) {
        io = startServer();
        io.on('connection',
              socket => socket.emit('state', store.getState().toJS())
             );
    }
    login(io);
};


main();
