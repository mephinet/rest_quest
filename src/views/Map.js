import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Row from './Row';

const Map = ({map}) => {
    if (!map) {
        return <span>No map yet</span>;
    }
    if (!map.get('rows')) {
        return <span>No rows yet</span>;
    }
    const myPos = map.get('myPos');
    const rows = map.get('rows').map(
        (r, pos) =>
            <Row key={pos} cells={r}
                 myCell={(myPos && pos === myPos.get('y')) ? myPos.get('x') : undefined} />
    );
    return (<table>
            <tbody>
            {rows}
            </tbody>
            </table>);
};

Map.propTypes = {
    map: ImmutablePropTypes.map.isRequired
};

export default Map;
