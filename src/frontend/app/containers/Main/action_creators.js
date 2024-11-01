import Fetcher from '../../fetcher';

export function botTyping(node, greetingsNode, content, greetings = false) {
    return dispatch => {
        dispatch({
            type: 'BOT_TYPING'
        });
        setTimeout(() => {
            dispatch(updateContent(content));
            dispatch({
                type: 'BOT_FINISH_TYPING'
            });

            const newRowIndex = content.rowIndex + 1;
            const currentNode = greetings ? greetingsNode : node;
            if (newRowIndex < currentNode.bot_collection.length) {
                setTimeout(() => {
                    const el = currentNode.bot_collection[newRowIndex];
                    const row = {
                        id: el.id,
                        type: 'bot',
                        content: el.bot_content,
                        action: el.bot_action
                    };

                    dispatch(botTyping(node, greetingsNode, {content: [...content.content, row], rowIndex: newRowIndex}, greetings));
                }, 500);
            } else if (newRowIndex === currentNode.bot_collection.length) {
                if (currentNode.children.length === 0) {
                    if (greetings) {
                        dispatch(setGreetings(node, greetingsNode, content, true));
                    }
                } else {
                    dispatch(renderUserActions(1));
                }
            }
        }, 1500);
    };
}

export function renderUserActions(value) {
    return {
        type: 'RENDER_USER_ACTIONS',
        payload: value
    };
}

export function setActiveNode(node, greetingsNode = null, content = null) {
    if (!content) {
        return {
            type: 'SET_ACTIVE_NODE',
            payload: node
        };
    } else {
        return dispatch => {
            dispatch({
                type: 'SET_ACTIVE_NODE',
                payload: node
            });
            dispatch(botTyping(node, greetingsNode, content));
        };
    }
}

export function setActiveGreetingsNode(node, greetingsNode, content) {

    return dispatch => {
        dispatch({
            type: 'SET_ACTIVE_GREETINGS_NODE',
            payload: greetingsNode
        });
        dispatch(botTyping(node, greetingsNode, content, true));
    };
}

export function updateContent(content) {
    return {
        type: 'UPDATE_CONTENT',
        payload: content
    };
}

export function fetchNextNode(greetingsNode, content, url) {
    return async dispatch => {
        const nextNode = await Fetcher.fetchNextNode(url);
        dispatch(setActiveNode(nextNode, greetingsNode, getRow(nextNode, content)));
    };
}

export function fetchNextGreetingsNode(node, content, url) {
    return async dispatch => {
        const nextNode = await Fetcher.fetchNextNode(url);
        dispatch(setActiveGreetingsNode(node, nextNode, getRow(nextNode, content)));
    };
}

function getRow(node, content) {
    if (node.bot_collection.length > 0) {
        const el = node.bot_collection[0];
        const row = {
            id: el.id,
            type: 'bot',
            content: el.bot_content,
            action: el.bot_action
        };
        return {content: [...content.content, row], rowIndex: 0};
    }

    return content;
}

export function setInputValue(value) {
    return {
        type: 'SET_INPUT',
        payload: value
    };
}

export function setName(value) {
    return {
        type: 'SET_NAME',
        payload: value
    };
}

export function setGreetings(node, greetingsNode, content, value) {
    return dispatch => {
        setTimeout(() => {
            dispatch({
                type: 'SET_GREETINGS',
                payload: value
            });
            dispatch(botTyping(node, greetingsNode, getRow(node, content)));

        }, 500);
    };
}

export function processUserResponse(data) {
    return dispatch => {
        dispatch({
            type: 'USER_RESPONSE',
            payload: data
        });
        if (data.type === 'node') {
            dispatch(fetchNextNode(data.greetingsNode, data.newContent, data.fetchUrl));
        } else {
            dispatch(fetchNextGreetingsNode(data.node, data.newContent, data.fetchUrl));
        }
    };
}

export function processFormSubmit(data) {
    return dispatch => {
        dispatch({
            type: 'FORM_SUBMIT',
            payload: data
        });
        dispatch(fetchNextGreetingsNode(data.node, data.newContent, data.fetchUrl));
    };
}

export function showMuteText(value) {
    return {
        type: 'SHOW_TEXT',
        payload: value
    };
}

export function muteBot(value) {
    return {
        type: 'MUTE',
        payload: value
    };
}