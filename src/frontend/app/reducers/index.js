import { combineReducers } from 'redux';
import ChatbotTypingReducer from './reducer_bot_typing';
import NodeReducer from './reducer_node';
import RenderUsrActionsReducer from './reducer_user_actions';
import RenderReducer from './reducer_render';
import GreetingsNodeReducer from './reducer_greetings_node';
import UserNameReducer from './reducer_username';
import MuteReducer from './reducer_mute';

const rootReducer =  combineReducers({
    activeNode: NodeReducer,
    greetingsNode: GreetingsNodeReducer,
    typing: ChatbotTypingReducer,
    usrActions: RenderUsrActionsReducer,
    renderedContent: RenderReducer,
    userName: UserNameReducer,
    mute: MuteReducer
});

export default rootReducer;
