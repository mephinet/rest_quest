import React from 'react';

class Counter extends React.Component {
    render() {
        return (<div>
                  <h1>{this.props.value}</h1>
                  <button onClick={this.props.onIncrement}>+</button>
                  <button onClick={this.props.onDecrement}>-</button>
                </div>
               )
    }
}

export default Counter;
