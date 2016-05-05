import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Header from './Header';
import Map from './Map';
import Strategy from './Strategy';

const App = ({map, config}) => {
    const strategy = map ? map.getIn(['qm', 'strategy']) : null;

    const h = <Header username={config.get('username')} />;
    const m = map ? <Map map={map.get('qm')} /> : null;
    const s = strategy ? <Strategy highscore={strategy.get('highscore')} route={strategy.get('route')} /> : null;

    return (<div>
            {h}
            {m}
            {s}
            </div>);
};

App.propTypes = {
    map: ImmutablePropTypes.map.isRequired,
    config: ImmutablePropTypes.map.isRequired
};

export default App;
