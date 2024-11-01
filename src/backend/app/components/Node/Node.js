import React from 'react';
import styled from 'styled-components';
import {NodeRow, NodeContent, ControlElements} from 'components/_Tree/styles';
import Popup from 'components/Popup/Popup';
import Dialog from 'react-toolbox/lib/dialog';
import FontIcon from 'react-toolbox/lib/font_icon';
import CreateButton from 'components/Button/CreateButton';
import EditButton from 'components/Button/EditButton';
import DeleteButton from 'components/Button/DeleteButton';

const NodeElement = styled.div`
    background-color: #ffffff;
    overflow:auto;
    width: 200px;
    border: 1px solid #ccc;
    padding: 5px 10px;
    text-decoration: none;
    color: #666;
    font-family: "Roboto Slab",Arial,sans-serif;;
    font-size: 11px;
    display: flex;
    flex-direction: column;
    margin: auto;
    border-radius: 5px;
    transition: all 0.5s;
`;

const Node = (props) => {
    let botRows = [];
    const botCol = props.nodeData.get('bot_collection');

    for (let i = 0; i < botCol.size; i++) {
        botRows = [...botRows,
            <NodeRow key={i}>
                <div className="node-image">
                    <span>
                        <FontIcon value='android' />
                    </span>
                </div>
                <NodeContent>
                    {botCol.getIn([i, 'bot_content'])}
                </NodeContent>
            </NodeRow>
        ];
    }

    let nodes = [];
    const nds = props.nodeData.get('children');
    for (let i = 0; i < nds.size; i++) {
        nodes = [...nodes,
            <Node
                key={i}
                index={i}
                nodeData={nds.get(i)}
                activeNode={props.activeNode}
                isSystemTree={props.isSystemTree}
                onSubmit={props.onSubmit}
                handleOpenModal={props.handleOpenModal}
                handleCloseModal={props.handleCloseModal}
                openModal={props.openModal}
                handleAddNewBotRow={props.handleAddNewBotRow}
                handleRemoveBotRow={props.handleRemoveBotRow}
                onUserInputChange={props.onUserInputChange}
                onBotInputChange={props.onBotInputChange}
                onBotDropDownChange={props.onBotDropDownChange}
                onUserDropDownChange={props.onUserDropDownChange}
                handleDeleteNode={props.handleDeleteNode}
                handleAddNode={props.handleAddNode} />
        ];
    }

    let renderChildren = () => {
        if (nds.size > 0) {
            return (
                <div className="parent">
                    {nodes}
                </div>
            );
        }
    };

    const dialogTitle = props.activeNode && props.activeNode.get('id') ? 'Edit item with "id" ' + props.activeNode.get('id') : 'Create new node';
    const delBtn = props.nodeData.get('parent') > 0 ? true : false;

    return (
        <div className="child">
            <NodeElement id={`element${props.nodeData.get('id')}`}>
                <ControlElements>
                    <CreateButton onClick={props.handleAddNode} path={props.nodeData.get('path')}/>
                    <EditButton onClick={props.handleOpenModal} path={props.nodeData.get('path')}/>
                    {delBtn ? <DeleteButton onClick={props.handleDeleteNode} path={props.nodeData.get('path')}/> : ''}
                    <Dialog
                        title={dialogTitle}
                        active={props.openModal}
                        actions={[{label: 'Close', onClick: props.handleCloseModal }]}
                        onEscKeyDown={props.handleCloseModal}
                        onOverlayClick={props.handleCloseModal}
                        className='modal-dialog'
                    >
                        <Popup
                            data={props.activeNode}
                            index={props.index}
                            isSystemTree={props.isSystemTree}
                            onSubmit={props.onSubmit}
                            handleAddNewBotRow={props.handleAddNewBotRow}
                            handleRemoveBotRow={props.handleRemoveBotRow}
                            onUserInputChange={props.onUserInputChange}
                            onBotInputChange={props.onBotInputChange}
                            onUserDropDownChange={props.onUserDropDownChange}
                            onBotDropDownChange={props.onBotDropDownChange} />
                    </Dialog>
                </ControlElements>
                <NodeRow>
                    <div className="node-image">
                        <span>
                            <FontIcon value='person' />
                        </span>
                    </div>
                    <NodeContent>
                        {props.nodeData.get('user_content')}
                    </NodeContent>
                </NodeRow>
                {botRows}
            </NodeElement>
            {renderChildren()}
        </div>
    );
};

export default Node;