export default function(state = {nodeChanged: false, node: null}, action) {
    switch (action.type) {
        case 'SET_ACTIVE_NODE':
            return {nodeChanged: state.nodeChanged, node: action.payload};
        case 'ACTIVE_NODE_CHANGED':
            return {nodeChanged: action.payload, node: state.node};
    }

    return state;
}