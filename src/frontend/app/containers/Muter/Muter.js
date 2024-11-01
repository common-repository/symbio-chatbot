import React, { Component } from 'react';
import * as actionCreators from './action_creators';
import { connect } from 'react-redux';
import Mute from 'components/Mute/Mute';
import gtm from '_utils/gtm';

import Cookies from 'universal-cookie';

class MuterComponent extends Component {
    constructor(props) {
        super(props);
        this.baseUrl = props.baseUrl;
        this.handleMute = this.handleMute.bind(this);
        this.cookies = new Cookies();
        this.timer = null;
    }

    handleMute() {
        const newVal = this.props.mute == 1 ? 0 : 1;
        this.cookies.set('mute', newVal);

        let event;
        const eventName = newVal == 1 ? 'chatbot-off' : 'chatbot-on';
        if (window.CustomEvent) {
            event = new CustomEvent(eventName);
        } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(eventName, true, true);
        }
        document.body.dispatchEvent(event);

        if(!this.timer) {
            this.props.muteBot(newVal);
            this.props.showMuteText(true);

            this.timer = setTimeout(() => {
                this.props.showMuteText(false);
                this.timer = null;
            }, 1000);
        }

        gtm({
            'event': 'CHATBOT',
            'category': window.location.pathname,
            'action': window.localStorage.getItem('botID'),
            'label': 'mute'
        });
    }

    render() {
        return (
            <Mute
                baseUrl={this.baseUrl}
                showText={this.props.showText}
                textOff='Konverzace vypnuta'
                textOn='Konverzace zapnuta'
                mute={this.props.mute == 1}
                handleMute={this.handleMute}/>
        );
    }
}

function mapStateToProps(state) {
    return {
        showText: state.showText,
        mute: state.mute
    };
}

export const Muter = connect(mapStateToProps, actionCreators)(MuterComponent);

export const isMuterLoaded = ()=> {
    return window.localStorage.getItem('muter_loaded') === 'true' || false;
};

export const setMuterLoaded = (value)=> {
    window.localStorage.setItem('muter_loaded', value);
};

export default Muter;

