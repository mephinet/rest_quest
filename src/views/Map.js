import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Row from './Row';

const Map = ({map}) => {
    if (!(map && map.get('rows'))) {
        return <span>No map received yet - waiting for 2<sup>nd</sup> player?</span>;
    }

    const rows = map.get('rows').map(
        (r, pos) => <Row key={pos} cells={r} />
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
