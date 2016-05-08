import React from 'react';

const Strategy = ({route, remainingStepCost, phase}) => {
    return (<div className="strategy">
            <div className="phase">Phase: {phase}</div>
            <div className="route">Best route: {route} ({remainingStepCost} steps left)</div>
            </div>);
};

Strategy.propTypes = {
    route: React.PropTypes.string,
    phase: React.PropTypes.string,
    remainingStepCost: React.PropTypes.number
};

export default Strategy;
