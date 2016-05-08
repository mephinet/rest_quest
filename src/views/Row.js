import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Cell from './Cell';
import UnknownCell from './UnknownCell';

const Row = ({cells}) => {
    const content = cells.map(
        (c, pos) =>
            c ? <Cell key={pos} type={c.get('type')}
                  myCastle={c.get('myCastle')}
                  enemyCastle={c.get('enemyCastle')}
                  treasure={c.get('treasure')}
                  moveCost={c.get('moveCost')}
                  cumulatedCost={c.get('cumulatedCost')}
                  route={c.get('route')}
                  routed={c.get('routed')}
                  visibilityGain={c.get('visibilityGain')}
                  score={c.get('score')}
                  myCell={c.get('myCell')}
            />
            : <UnknownCell key={pos} />
    );

    return (<tr>
            {content}
            </tr>);
};

Row.propTypes = {
    cells: ImmutablePropTypes.list.isRequired,
    myCell: React.PropTypes.number
};

export default Row;
