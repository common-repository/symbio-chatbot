export function showMuteText(value) {
    return {
        type: 'SHOW_TEXT',
        payload: value
    };
}

export function muteBot(value) {
    localStorage.setItem('mute', value);
    return {
        type: 'MUTE',
        payload: value
    };
}