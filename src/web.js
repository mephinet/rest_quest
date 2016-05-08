import 'babel-polyfill';

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
              render(<App qm={fromJS(state.qm)}
                     config={fromJS(state.config)}
                     phase={fromJS(state.phase)}
                     />,
                     document.getElementById('root')
                    );
          }
         );
