import React,{ Component } from 'react';
import Node from 'components/Node/Node';
import {fromJS} from 'immutable';
import 'whatwg-fetch';

export default class Graph extends Component {

    constructor(props) {
        super(props);
        this.state = {
            node: {},
            activeNode: null,
            openModal: false,
            tree_id: '',
            isLoading: true,
            isSystemTree: 0
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleAddNewBotRow = this.handleAddNewBotRow.bind(this);
        this.onUserInputChange = this.onUserInputChange.bind(this);
        this.onBotInputChange = this.onBotInputChange.bind(this);
        this.onBotDropDownChange = this.onBotDropDownChange.bind(this);
        this.onUserDropDownChange = this.onUserDropDownChange.bind(this);
        this.handleDeleteNode = this.handleDeleteNode.bind(this);
        this.handleAddNode = this.handleAddNode.bind(this);
        this.handleRemoveBotRow = this.handleRemoveBotRow.bind(this);
    }

    componentDidMount() {
        this.setState((previousState) => {
            return { ...previousState, tree_id: this.props.treeId, isSystemTree: this.props.isSystemTree };
        });
        this.fetchNodes();
    }

    onSubmit(e, path) {
        e.preventDefault();
        const url = this.state.activeNode.get('id') ? this.props.handleNodeUrl + this.state.activeNode.get('id') : this.props.handleNodeUrl;
        fetch(url, { method: 'POST', body: JSON.stringify(this.state.activeNode.toJSON()) })
            .then(response => response.json())
            .then(data => {
                let node = this.state.activeNode;
                if (data['nid']) {
                    node = node.set('id', data['nid']);
                }
                for (let i = 0; i < node.get('bot_collection').size; i++) {
                    node = node.setIn(['bot_collection', i, 'id'], data['bots'][i]);
                }

                this.setState((previousState) => {
                    return { ...previousState, activeNode: node, node: this.state.node.setIn(path, node) };
                });
            });

        this.handleCloseModal();
    }

    handleOpenModal(path) {
        this.setState((previousState) => {
            return {...previousState, openModal: true, activeNode: this.state.node.getIn(path)};
        });
    }

    handleCloseModal() {
        this.setState((previousState) => {
            return {...previousState, openModal: false};
        });
    }

    handleAddNewBotRow() {
        let node = this.state.activeNode;
        const col = node.get('bot_collection').push(fromJS({id: '', node_id: node.get('id'), bot_content: '', bot_action: ''}));

        this.setState((previousState) => {
            return {...previousState, activeNode: node.set('bot_collection', col)};
        });
    }

    handleRemoveBotRow(id) {
        let node = this.state.activeNode;
        const col = node.get('bot_collection').filterNot(el => el.get('id') == id);

        this.setState((previousState) => {
            return {...previousState, activeNode: node.set('bot_collection', col)};
        });
    }

    onUserInputChange(value) {
        let node = this.state.activeNode;
        this.setState((previousState) => {
            return {...previousState, activeNode: node.set('user_content', value)};
        });
    }

    onUserDropDownChange(value) {
        let node = this.state.activeNode;
        this.setState((previousState) => {
            return {...previousState, activeNode: node.set('user_action', value)};
        });
    }

    onBotInputChange(index, value) {
        let node = this.state.activeNode;
        this.setState((previousState) => {
            return {...previousState, activeNode: node.setIn(['bot_collection', index, 'bot_content'], value)};
        });
    }

    onBotDropDownChange(index, value) {
        let node = this.state.activeNode;
        this.setState((previousState) => {
            return {...previousState, activeNode: node.setIn(['bot_collection', index, 'bot_action'], value)};
        });
    }

    handleDeleteNode(path) {
        const id = this.state.node.getIn([...path, 'id']);
        fetch(this.props.handleNodeUrl + id, { 'method': 'DELETE' });
        let parentNode = this.state.node.getIn(path.slice(0, -2));
        let children = this.state.node.getIn([...path, 'children']);
        let parentChildren = parentNode.get('children');
        for (let i = 0; i < children.size; i++) {
            children = children.setIn([i, 'parent'], parentNode.get('id'));
            parentChildren = parentChildren.push(children.get(i));
        }
        parentNode = parentNode.set('children', parentChildren);

        let node = this.state.node.setIn(path.slice(0, -2), parentNode).deleteIn(path);
        node = this.updateNodesPath(node, []);

        this.setState((previousState) => {
            return {...previousState, node: node};
        });
    }

    handleAddNode(path) {
        const parentNode = this.state.node.getIn(path);
        let node = fromJS({
            id: '',
            user_content: '',
            user_action: '',
            bot_collection: [
                {
                    bot_action: '',
                    bot_content: ''
                }
            ],
            parent: parentNode.get('id'),
            children: [],
            tree_id: this.state.tree_id,
            path: [...path, 'children', this.state.node.getIn([...path, 'children']).size]
        });

        this.setState((previousState) => {
            return {...previousState, openModal: true, activeNode: node};
        });
    }

    updateNodesPath(node, path) {
        if (node) {
            for (let i = 0; i < node.getIn([...path, 'children']).size; i++) {
                node = this.updateNodesPath(node, [...path, 'children', i]);
            }

            return node.setIn([...path, 'path'], path);
        }
        return {};
    }

    fetchNodes() {
        fetch(this.props.fetchNodesUrl + this.props.treeId)
            .then(data => data.json())
            .then(json => {
                const node = this.updateNodesPath(fromJS(json), []);
                this.setState((previousState) => {
                    return {...previousState, node: node, isLoading: false};
                });
            });
    }

    render() {
        return (
            <div className="tree">
                <div className="parent">
                    {!this.state.isLoading ?
                        <Node
                            nodeData={this.state.node}
                            activeNode={this.state.activeNode}
                            isSystemTree={this.state.isSystemTree}
                            onSubmit={this.onSubmit}
                            handleOpenModal={this.handleOpenModal}
                            handleCloseModal={this.handleCloseModal}
                            openModal={this.state.openModal}
                            handleAddNewBotRow={this.handleAddNewBotRow}
                            handleRemoveBotRow={this.handleRemoveBotRow}
                            onUserInputChange={this.onUserInputChange}
                            onBotInputChange={this.onBotInputChange}
                            onBotDropDownChange={this.onBotDropDownChange}
                            onUserDropDownChange={this.onUserDropDownChange}
                            handleDeleteNode={this.handleDeleteNode}
                            handleAddNode={this.handleAddNode} /> : ''}
                </div>
            </div>
        );
    }
}
