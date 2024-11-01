import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers/index';
import thunk from 'redux-thunk';
import { setActiveNode } from './containers/Main/action_creators';

const middleware = [thunk];

export default function createChatbotStore(node) {
    const store = createStore(
        rootReducer,
        compose(
            applyMiddleware(...middleware),
            window.devToolsExtension ? window.devToolsExtension() : f => f
        )
    );
    store.dispatch(setActiveNode(node));

    return store;
}


