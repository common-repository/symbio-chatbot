export default function(state = {inputValue: null, name: sessionStorage.getItem('name'), greetings: sessionStorage.getItem('greetings') == '1'}, action) {
    switch (action.type) {
        case 'SET_INPUT':
            return {inputValue: action.payload, name: state.name, greetings: state.greetings};
        case 'SET_NAME':
            return {inputValue: state.inputValue, name: action.payload, greetings: state.greetings};
        case 'SET_GREETINGS':
            return {inputValue: state.inputValue, name: state.name, greetings: action.payload};
        case 'FORM_SUBMIT':
            return {inputValue: state.inputValue, name: action.payload.name, greetings: state.greetings};
    }

    return state;
}