import React from 'react';

const Header = ({username}) => {
    return (<h1>rest_quest status of user {username}</h1>);
};

Header.propTypes = {
    username: React.PropTypes.string.isRequired
};

export default Header;
