export default function(state = -1, action) {
    switch (action.type) {
        case 'RENDER_USER_ACTIONS':
            return action.payload;
        case 'USER_RESPONSE':
            return action.payload.usrActions;
        case 'FORM_SUBMIT':
            return action.payload.usrActions;
    }

    return state;
}