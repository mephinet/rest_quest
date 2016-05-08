import React from 'react';
//import ImmutablePropTypes from 'react-immutable-proptypes';

import classNames from 'classnames';

const Cell = ({type, treasure, myCell, myCastle, enemyCastle, moveCost, cumulatedCost, route, routed, visibilityGain, score}) => {
    const cn = classNames(type, {my: myCell, myCastle, enemyCastle, treasure, routed});
    const cost = v => v >= 100 ? '∞' : v;

    const scoreSpan = score !== undefined ? <span className="details score">s:{score.toPrecision(3)}</span> : null;
    const routeSpan = route ? <span className="details route">r:{route}</span> : null;

    return (<td className={cn}>
            <span className="details visibilityGain">vg:{visibilityGain}</span>
            <span className="details type">{type}</span>
            <span className="details moveCost">mc:{cost(moveCost)}</span>
            <span className="details cumulatedCost">cc:{cost(cumulatedCost)}</span>
            {scoreSpan}
            {routeSpan}
            </td>);
};

Cell.propTypes = {
    type: React.PropTypes.string,
    treasure: React.PropTypes.bool,
    myCell: React.PropTypes.bool,
    myCastle: React.PropTypes.bool,
    enemyCastle: React.PropTypes.bool,
    routed: React.PropTypes.bool,
    moveCost: React.PropTypes.number,
    cumulatedCost: React.PropTypes.number,
    visibilityGain: React.PropTypes.number,
    score: React.PropTypes.number,
    route: React.PropTypes.string
};

export default Cell;
