export default function(state = {showText: false, mute: localStorage.getItem('mute')}, action) {
    switch (action.type) {
        case 'SHOW_TEXT':
            return {showText: action.payload, mute: state.mute};
        case 'MUTE':
            return {showText: state.showText, mute: action.payload};
    }

    return state;
}