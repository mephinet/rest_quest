import io from 'socket.io-client';

const socket = io(
    `${location.protocol}//${location.hostname}:8090`
);

socket.on('state', state => document.getElementById('root').innerHTML = JSON.stringify(state));
