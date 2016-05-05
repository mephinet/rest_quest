import React from 'react';
//import ImmutablePropTypes from 'react-immutable-proptypes';

import classNames from 'classnames';

const Cell = ({type, myCell, myCastle, enemyCastle, moveCost, cumulatedCost, route, visibilityGain, score}) => {
    const cn = classNames(type, {my: myCell, myCastle, enemyCastle});

    return (<td className={cn}>
            <span className="details type">{type}</span>
            <span className="details moveCost">mc:{moveCost}</span>
            <span className="details cumulatedCost">cc:{cumulatedCost}</span>
            <span className="details route">r:{route}</span>
            <span className="details visibilityGain">vg:{visibilityGain}</span>
            <span className="details score">s:{ score === undefined ? '?' : score.toPrecision(3) }</span>
            </td>);
};

Cell.propTypes = {
    type: React.PropTypes.string,
    myCell: React.PropTypes.bool,
    myCastle: React.PropTypes.bool,
    enemyCastle: React.PropTypes.bool,
    moveCost: React.PropTypes.number,
    cumulatedCost: React.PropTypes.number,
    visibilityGain: React.PropTypes.number,
    score: React.PropTypes.number,
    route: React.PropTypes.string
};

export default Cell;
