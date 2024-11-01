export default function(state = false, action) {
    switch (action.type) {
        case 'BOT_TYPING':
            return true;
        case 'BOT_FINISH_TYPING':
            return false;
    }

    return state;
}