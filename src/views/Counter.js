import React from 'react';

const Counter = ({id, value, onIncrement, onDecrement}) => {
    return (<div>
            <h1>Counter {id}: {value}</h1>
            <button onClick={onIncrement}>+</button>
            <button onClick={onDecrement}>-</button>
            </div>);
};

Counter.propTypes = {
    id: React.PropTypes.number.isRequired,
    value: React.PropTypes.number.isRequired,
    onIncrement: React.PropTypes.func,
    onDecrement: React.PropTypes.func
};

export default Counter;
