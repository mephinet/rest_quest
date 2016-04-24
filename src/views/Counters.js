import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Counter from './Counter';

const Counters = ({
    values, reverse,
    onIncrement, onDecrement,
    onAddCounter,onToggleReverse
}) => {
    const counters = values
          .map((v, k) => { return {id: k, value: v};})
          .sortBy(v => reverse ? -(v.id) : v.id)
          .map(v =>
               <Counter key={v.id} id={v.id} value={v.value}
               onIncrement={() => onIncrement(v.id)}
               onDecrement={() => onDecrement(v.id)}
               />
              );
    return (<div>
            {counters}
            <hr />
            <button onClick={onAddCounter}>Add Counter</button>
            <button onClick={onToggleReverse}>Reverse</button>
            </div>);
};

Counters.propTypes = {
    values: ImmutablePropTypes.list.isRequired,
    reverse: React.PropTypes.bool,
    onIncrement: React.PropTypes.func,
    onDecrement: React.PropTypes.func,
    onAddCounter: React.PropTypes.func,
    onToggleReverse: React.PropTypes.func
};

export default Counters;
