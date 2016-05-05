import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Row from './Row';

const Map = ({map}) => {
    if (!(map && map.get('rows'))) {
        return <span>No map received yet - waiting for 2<sup>nd</sup> player?</span>;
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
