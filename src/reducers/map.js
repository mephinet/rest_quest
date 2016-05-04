import {combineReducers} from 'redux-immutable';

import qm from './qm';
import phase from './phase';

const map = combineReducers({qm, phase});

export default map;
