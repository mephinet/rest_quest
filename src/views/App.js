import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Header from './Header';
import Map from './Map';

const App = ({map, config}) => {
    let m = map ? <Map map={map.get('qm')} /> : null;
    return (<div>
            <Header username={config.get('username')} />
            {m}
            </div>);
};

App.propTypes = {
    map: ImmutablePropTypes.map.isRequired,
    config: ImmutablePropTypes.map.isRequired
};

export default App;
