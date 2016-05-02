import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Header from './Header';
import Map from './Map';

const App = ({map, config}) => {
    return (<div>
            <Header username={config.get('username')} />
            <Map map={map.get('qm')} />
            <span>{JSON.stringify(map)}</span>
            </div>);
};

App.propTypes = {
    map: ImmutablePropTypes.map.isRequired,
    config: ImmutablePropTypes.map.isRequired
};

export default App;
