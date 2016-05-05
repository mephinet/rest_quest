import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Header from './Header';
import Map from './Map';
import Strategy from './Strategy';

const App = ({map, config}) => {
    const m = map ? <Map map={map.get('qm')} /> : null;
    const strategy = map ? map.get('qm').get('strategy') : null;
    return (<div>
            <Header username={config.get('username')} />
            {m}
            <Strategy highscore={strategy.get('highscore')} route={strategy.get('route')} />
            </div>);
};

App.propTypes = {
    map: ImmutablePropTypes.map.isRequired,
    config: ImmutablePropTypes.map.isRequired
};

export default App;
