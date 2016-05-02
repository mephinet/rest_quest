import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Cell from './Cell';

const Row = ({cells, myCell}) => {
    const content = cells.map((c, pos) => <Cell key={pos} type={c.get('type')} myCell={pos === myCell} />);
    return (<tr>
            {content}
            </tr>);
};

Row.propTypes = {
    cells: ImmutablePropTypes.list.isRequired,
    myCell: React.PropTypes.number
};

export default Row;
