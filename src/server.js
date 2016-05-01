import Server from 'socket.io';

const startServer = () => {
    return new Server().attach(8090);
};

export default startServer;
