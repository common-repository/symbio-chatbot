import React, { Component } from 'react';
import Avatar from 'components/Avatar/Avatar';
import Bubble from 'components/Bubble/Bubble';
import UsrChoice from 'components/UsrAction/UsrChoice';
import Video from 'components/Video/Video';
import Image from 'components/Image/Image';
import Link from 'components/Link/Link';
import Form from 'components/Form/Form';
import Loader from 'components/Loader/Loader';
import styled from 'styled-components';
import { media } from '_utils/mixins';
import * as actionCreators from './action_creators';
import { connect } from 'react-redux';
import gtm from '_utils/gtm';

const Container = styled.div`
    width: 100%;
    max-width: 591px;
    font-weight: 300 !important;
    font-family: "Roboto Slab", serif !important;
    p {
        font-weight: 300;
        font-family: "Roboto Slab", serif;
        width: auto;
        font-size: 12px;
        ${ media.tablet`
            font-size: 16px;
        `}
    }
`;

const ContentRow = styled.div`
    margin-bottom: 5px;
    position: relative;
    padding-left: 45px;

    &:after {
        content: "";
        display: block;
        clear: both;
    }

    ${ media.tablet`
        padding-left: 105px;
        margin-bottom: 10px;
    `}
`;

const UsrRow = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin: 25px 0 0 0;
    ${ media.tablet`
        flex-direction: row;
        margin: 40px 0 0 0;
    `}
`;

class Main extends Component {
    constructor(props) {
        super(props);
        this.bot = props.bot;
        this.colorData = props.colorData;
        this.baseUrl = props.baseUrl;
        this.fetchNodeUrl = props.fetchNodeUrl;
        this.onUserResponse = this.onUserResponse.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }

    onUserResponse(row, treeId) {
        const data = {
            usrActions: 0,
            newContent: {
                content: [...this.props.renderedContent.content, row],
                rowIndex: -1
            },
            fetchUrl: this.fetchNodeUrl + treeId + '/' + row.id,
            type: this.props.userName.greetings ? 'node' : 'greetings-node',
            node: this.props.activeNode.node,
            greetingsNode: this.props.greetingsNode.node
        };

        this.props.processUserResponse(data);

        gtm({
            'event': 'CHATBOT',
            'category': window.location.pathname,
            'action': window.localStorage.getItem('botID'),
            'label': 'button clicked'
        });
    }

    onFormSubmit(e, nextNodeId, treeId) {
        e.preventDefault();
        sessionStorage.setItem('name', this.props.userName.inputValue);
        const data = {
            usrActions: 0,
            newContent: {
                content: [...this.props.renderedContent.content,
                    {
                        id: nextNodeId,
                        type: 'user',
                        content: this.props.userName.inputValue,
                        action: 'text'
                    }
                ],
                rowIndex: this.props.renderedContent.rowIndex
            },
            name: this.props.userName.inputValue,
            fetchUrl: this.fetchNodeUrl + treeId + '/' + nextNodeId,
            node: this.props.activeNode.node
        };
        this.props.processFormSubmit(data);

        gtm({
            'event': 'CHATBOT',
            'category': window.location.pathname,
            'action': window.localStorage.getItem('botID'),
            'label': 'name entered'
        });
    }

    onInputChange(e) {
        this.props.setInputValue(e.target.value);
    }

    getRow(node) {
        if (node.bot_collection.length > 0) {
            const el = node.bot_collection[0];
            const row = {
                id: el.id,
                type: 'bot',
                content: el.bot_content,
                action: el.bot_action
            };
            return {content: [...this.props.renderedContent.content, row], rowIndex: 0};
        }

        return {content: [], rowIndex: -1};
    }

    greet() {
        let date = new Date();
        date.setDate(date.getDate() + 1);
        sessionStorage.setItem('greetings', '1');
        const node = this.props.userName.name ? this.bot.system_trees[1] : this.bot.system_trees[0];
        this.props.setActiveGreetingsNode(this.props.activeNode.node, node, this.getRow(node));
    }

    componentDidMount() {
        if (!this.props.userName.greetings) {
            this.greet();
        } else {
            this.props.botTyping(this.props.activeNode.node, this.props.greetingsNode.node, this.getRow(this.props.activeNode.node));
        }
        document.body.addEventListener('chatbot-on', () => {this.props.muteBot(0);});
        document.body.addEventListener('chatbot-off', () => {this.props.muteBot(1);});

        // gtm
        window.localStorage.setItem('botID', Number(window.localStorage['botID']) + 1);

        gtm({
            'event': 'CHATBOT',
            'category': window.location.pathname,
            'action': window.localStorage.getItem('botID'),
            'label': 'start'
        });
    }

    renderBubble(index, type, avatar = false) {
        const content = this.props.renderedContent.content;
        if (avatar) {
            switch (type) {
                case 'link':
                    return <ContentRow key={index}>
                                <Avatar name={this.bot.name} image={this.bot.avatar} />
                                <Bubble bot avatar baseUrl={this.baseUrl} colorData={this.colorData}><Link url={content[index].content}/></Bubble>
                           </ContentRow>;
                case 'variable':
                    return <ContentRow key={index}>
                                <Avatar name={this.bot.name} image={this.bot.avatar} />
                                <Bubble bot avatar baseUrl={this.baseUrl} colorData={this.colorData}>{content[index].content.replace('[:name]', this.props.userName.name)}</Bubble>
                           </ContentRow>;
                default:
                    return <ContentRow key={index}>
                                <Avatar name={this.bot.name} image={this.bot.avatar} />
                                <Bubble bot avatar baseUrl={this.baseUrl} colorData={this.colorData}>{content[index].content}</Bubble>
                           </ContentRow>;
            }
        } else {
            switch (type) {
                case 'video':
                    return <Video key={index} url={content[index].content}/>;
                case 'image':
                    return <Image key={index} url={content[index].content}/>;
                case 'link':
                    return <ContentRow key={index}><Bubble bot baseUrl={this.baseUrl} colorData={this.colorData}><Link url={content[index].content}/></Bubble></ContentRow>;
                case 'variable':
                    return <ContentRow key={index}><Bubble bot baseUrl={this.baseUrl} colorData={this.colorData}>{content[index].content.replace('[:name]', this.props.userName.name)}</Bubble></ContentRow>;
                default:
                    return <ContentRow key={index}><Bubble bot baseUrl={this.baseUrl} colorData={this.colorData}>{content[index].content}</Bubble></ContentRow>;
            }
        }
    }

    render() {
        let content = () => {
            let rows = [];
            const content = this.props.renderedContent.content;
            for (let i = 0; i < content.length; i++) {
                let bubble = null;
                const nextIndex = i + 1;
                if (content[i].type === 'bot') {
                    if (content[i].action === 'video' || content[i].action === 'image') {
                        bubble = this.renderBubble(i, content[i].action);
                    } else {
                        if (((nextIndex === content.length || content[nextIndex].type ==='user') && !this.props.typing) || (content[nextIndex] !== undefined && content[nextIndex].type ==='user')) {
                            bubble = this.renderBubble(i, content[i].action, true);
                        } else {
                            bubble = this.renderBubble(i, content[i].action);
                        }
                    }
                } else {
                    bubble = <ContentRow key={i}><Bubble baseUrl={this.baseUrl} colorData={this.colorData}>{content[i].content}</Bubble></ContentRow>;
                }
                rows = [...rows, bubble];
            }
            if (this.props.typing) {
                rows = [...rows, <ContentRow key={-1}><Avatar name={this.bot.name} image={this.bot.avatar} /><Loader colorData={this.colorData}/></ContentRow>];
            }
            return rows;
        };

        let usrContent = () => {
            let rows = [];
            const activeNode = this.props.userName.greetings ? this.props.activeNode : this.props.greetingsNode;
            activeNode.node.children.map((child) => {
                let content = null;
                if (child.user_action === 'text') {
                    content = <ContentRow key={-2}><Form onSubmit={this.onFormSubmit} onInputChange={this.onInputChange} nextNodeId={child.id} treeId={child.tree_id} baseUrl={this.baseUrl} placeholder={this.bot.placeholder}/></ContentRow>;
                } else {
                    const row = {
                        id: child.id,
                        type: 'user',
                        content: child.user_content,
                        action: child.user_action
                    };
                    content = <UsrChoice
                        key={child.id}
                        colorData={this.colorData}
                        onClick={() => {
                            this.onUserResponse(row, child.tree_id);
                        }}
                        type={child.user_action === 'positive-option' ? 'positive' : 'negative'}
                        >{child.user_content}
                    </UsrChoice>;
                }

                rows = [...rows, content];
            });
            return rows;
        };

        if (this.props.mute.mute == 1) {
            return <Container/>;
        } else {
            return (
                <Container>
                    {content()}
                    {this.props.usrActions === 1 ? <UsrRow>{usrContent()}</UsrRow> : ''}
                </Container>
            );
        }

    }
}

function mapStateToProps(state) {
    return {
        activeNode: state.activeNode,
        greetingsNode: state.greetingsNode,
        typing: state.typing,
        rowIndex: state.rowIndex,
        usrActions: state.usrActions,
        renderedContent: state.renderedContent,
        userName: state.userName,
        mute: state.mute
    };
}

export default connect(mapStateToProps, actionCreators)(Main);