import React from 'react';

const GameOver = ({result}) => {
    const r = {won: 'you won', lost: 'you lost', draw: 'draw'}[result];
    return (<div className="game-over">
            <h1>Game over - {r}!</h1>
            </div>);
};

GameOver.propTypes = {
    result: React.PropTypes.string.isRequired
};

export default GameOver;
