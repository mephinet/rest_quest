const order = (state, action) => {
    switch(action && action.type) {
    case 'REVERSE':
        return state.update('reverse', r => !r);
    default:
        return state;
    }
}

export default order;
