import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Header from './Header';
import Map from './Map';
import Strategy from './Strategy';
import GameOver from './GameOver';

const App = ({qm, config, phase}) => {

    const strategy = qm ? qm.get('strategy') : null;

    const h = <Header username={config.get('username')} />;
    const m = qm ? <Map map={qm} /> : null;
    const s = strategy ? <Strategy route={strategy.get('route')}
                                   remainingStepCost={strategy.get('remainingStepCost')}
                                   phase={phase.get('phase')}
        /> : null;
    const result = phase.get('result');
    const g = result ? <GameOver result={result} /> : null;

    return (<div>
            {h}
            {m}
            {s}
            {g}
            </div>);
};

App.propTypes = {
    qm: ImmutablePropTypes.map.isRequired,
    config: ImmutablePropTypes.map.isRequired,
    phase: ImmutablePropTypes.map.isRequired,
    result: React.PropTypes.string
};

export default App;
