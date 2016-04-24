const order = (state = false, action) => {
    switch(action && action.type) {
    case 'REVERSE':
        return !state;
    default:
        return state;
    }
};

export default order;
