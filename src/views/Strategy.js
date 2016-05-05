import React from 'react';

const Strategy = ({route, highscore}) => {
    return (<div className="strategy">
            <div className="route">Best route: {route}</div>
            <div className="highscore">Highest score: {highscore}</div>
            </div>);
};

Strategy.propTypes = {
    route: React.PropTypes.string,
    highscore: React.PropTypes.number
};

export default Strategy;
