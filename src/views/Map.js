import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Row from './Row';

const Map = ({map}) => {
    const myPos = map.get('myPos');
    const rows = map.get('rows').map(
        (r, pos) =>
            <Row key={pos} cells={r}
                 myCell={(myPos && pos === myPos.get(1)) ? myPos.get(0) : undefined} />
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
