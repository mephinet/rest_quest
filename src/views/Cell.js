import React from 'react';
//import ImmutablePropTypes from 'react-immutable-proptypes';

import classNames from 'classnames';

const Cell = ({type, myCell, myCastle, enemyCastle, moveCost, cumulatedCost, route}) => {
    const cn = classNames(type, {my: myCell, myCastle, enemyCastle});

    return (<td className={cn}>
            <span className="type">{type}</span>
            <span className="moveCost">mc:{moveCost}</span>
            <span className="cumulatedCost">cc:{cumulatedCost}</span>
            <span className="route">r:{route}</span>
            </td>);
};

Cell.propTypes = {
    type: React.PropTypes.string,
    myCell: React.PropTypes.bool,
    myCastle: React.PropTypes.bool,
    enemyCastle: React.PropTypes.bool,
    moveCost: React.PropTypes.number,
    cumulatedCost: React.PropTypes.number,
    route: React.PropTypes.string
};

export default Cell;
