import React from 'react';
import Counter from './Counter';

class Counters extends React.Component {
    render() {
        let counters = this.props.value.map(
            (v, k) =>
                <Counter key={k} value={v}
                  onIncrement={() => this.props.onIncrement(k)}
                  onDecrement={() => this.props.onDecrement(k)}
                />
        );
        return <div>
            {counters}
            <hr />
            <button onClick={this.props.addCounter}>Add counter</button>
        </div>;
    }
}

export default Counters;
