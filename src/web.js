import io from 'socket.io-client';
import React from 'react';
import {render} from 'react-dom';
import {fromJS} from 'immutable';

import App from './views/App';

const socket = io(
    `${location.protocol}//${location.hostname}:8090`
);


socket.on('state',
          state => {
              console.log(state);
              render(<App map={fromJS(state.map)} config={fromJS(state.config)} />,
                     document.getElementById('root')
                    );
          }
         );
