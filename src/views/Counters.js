import React from 'react';
import Counter from './Counter';

class Counters extends React.Component {
    render() {
        const counters = this.props.values
              .map((v, k) => { return {id: k, value: v} })
              .sortBy(v => this.props.reverse ? -(v.id) : v.id)
              .map(v =>
                   <Counter key={v.id} id={v.id} value={v.value}
                   onIncrement={() => this.props.onIncrement(v.id)}
                   onDecrement={() => this.props.onDecrement(v.id)}
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
