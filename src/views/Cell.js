import React from 'react';
//import ImmutablePropTypes from 'react-immutable-proptypes';

const Cell = ({type, myCell}) => {
    const cn = myCell ? 'my' : undefined;
    
    return <td className={cn}>{type}</td>;
};

Cell.propTypes = {
    type: React.PropTypes.string,
    myCell: React.PropTypes.bool
};

export default Cell;
