export default function(state = {content: [], rowIndex: -1}, action) {
    switch (action.type) {
        case 'UPDATE_CONTENT':
            return action.payload;
        case 'RESET_ROW_INDEX':
            return { content: state.content, rowIndex: -1 };
        case 'USER_RESPONSE':
            return action.payload.newContent;
        case 'FORM_SUBMIT':
            return action.payload.newContent;
    }

    return state;
}