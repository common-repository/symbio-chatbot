import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import createChatbotStore from './store';
import muterStore from './muter_store';
import scrollMonitor from 'scrollMonitor';
import _globalStyles from '_utils/global-styles';
import Main from 'containers/Main/Main';
import {Muter, isMuterLoaded, setMuterLoaded} from 'containers/Muter/Muter';

setMuterLoaded('false');

window.initChatbot = function(renderElement, node, bot, baseUrl, fetchNodeUrl) {
    chatbot(renderElement, node, bot, baseUrl, fetchNodeUrl);
};

function chatbot(renderElement, node, bot, baseUrl, fetchNodeUrl) {
    const app = document.querySelector(renderElement);
    const watcher = scrollMonitor.create(app, -(Math.floor(window.innerHeight * 0.35)));
    let chatbotStarted = false;
    const mute = localStorage.getItem('mute') == 1;
    const startChatbot = () => {
        chatbotStarted = true;
        const colorData = {
            bot_bubble_bg: bot.bot_bubble_bg,
            bot_bubble_fg: bot.bot_bubble_fg,
            usr_bubble_bg: bot.usr_bubble_bg,
            usr_bubble_fg: bot.usr_bubble_fg,
            pos_choice_bg: bot.pos_choice_bg,
            pos_choice_fg: bot.pos_choice_fg,
            pos_choice_bc: bot.pos_choice_bc,
            neg_choice_bg: bot.neg_choice_bg,
            neg_choice_fg: bot.neg_choice_fg,
            neg_choice_bc: bot.neg_choice_bc
        };

        render(
            <Provider store={createChatbotStore(node)}>
                <Main bot={bot} colorData={colorData} baseUrl={baseUrl} fetchNodeUrl={fetchNodeUrl} />
            </Provider>
            , document.querySelector(renderElement)
        );
    };

    const startWatcher = () => {
        !chatbotStarted && watcher.one('enterViewport', startChatbot);
    };

    const stopWatcher = () => {
        watcher.off('enterViewport', startChatbot);
    };

    if (!mute) {
        startWatcher();
    }

    document.body.addEventListener('chatbot-on', startWatcher);
    document.body.addEventListener('chatbot-off', stopWatcher);

    // MUTER
    let muteDiv = document.createElement('DIV');
    document.body.appendChild(muteDiv);

    if (!isMuterLoaded()) {
        setMuterLoaded('true');
        render(
            <Provider store={muterStore}>
                <Muter baseUrl={baseUrl} />
            </Provider>,
            muteDiv
        );
    }

    if(window.localStorage) {
        window.localStorage.setItem('botID', 0);
    }
}
