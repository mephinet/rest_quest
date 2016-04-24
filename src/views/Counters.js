import React from 'react';
import Counter from './Counter';
import {Map} from 'immutable';

class Counters extends React.Component {
    render() {
        const counters = this.props.values
              .map((v, k) => Map({id: k, value: v}))
              .sortBy(v => this.props.reverse ? -(v.get("id")) : v.get("id"))
              .map(v =>
                   <Counter key={v.get("id")} id={v.get("id")} value={v.get("value")}
                   onIncrement={() => this.props.onIncrement(v.get("id"))}
                   onDecrement={() => this.props.onDecrement(v.get("id"))}
                   />
                  );
        return <div>
            {counters}
            <hr />
            <button onClick={this.props.addCounter}>Add Counter</button>
            <button onClick={this.props.onToggleReverse}>Reverse</button>
        </div>;
    }
}

export default Counters;
