import React from 'react';
//import ImmutablePropTypes from 'react-immutable-proptypes';

import classNames from 'classnames';

const Cell = ({type, myCell}) => {
    const cn = classNames({my: myCell});

    return <td className={cn}>{type}</td>;
};

Cell.propTypes = {
    type: React.PropTypes.string,
    myCell: React.PropTypes.bool
};

export default Cell;
