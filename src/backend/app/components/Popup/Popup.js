import React from 'react';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import BotRow from 'components/Row/BotRow';
import Dropdown from 'react-toolbox/lib/dropdown';
import {Row, InputCol, DropDownCol} from 'components/_Tree/styles';

const Popup = (props) => {
    let bots = () => {
        let out = '';
        const col = props.data.get('bot_collection');
        for (let i = 0; i < col.size; i++) {
            out = [
                ...out,
                <BotRow
                    key={i}
                    index={i}
                    value={col.getIn([i, 'bot_content'])}
                    action_value={col.getIn([i, 'bot_action'])}
                    rowId={col.getIn([i, 'id'])}
                    onBotInputChange={props.onBotInputChange}
                    onBotDropDownChange={props.onBotDropDownChange}
                    handleRemoveBotRow={props.handleRemoveBotRow} />
            ];
        }
        return out;
    };

    let dropdownValues = () => {
        if (props.isSystemTree) {
            return [
                { value: 'scroll', label: 'Scroll' },
                { value: 'text', label: 'Text Input' },
                { value: 'positive-option', label: 'Option - positive' },
                { value: 'negative-option', label: 'Option - negative' }
            ];
        } else {
            return [
                { value: 'scroll', label: 'Scroll' },
                { value: 'positive-option', label: 'Option - positive' },
                { value: 'negative-option', label: 'Option - negative' }
            ];
        }
    };

    return (
        <form method="POST" action="" onSubmit={(e) => { props.onSubmit(e, props.data.get('path')); }}>
            <Row>
                <InputCol>
                    <Input type='text' className='matInput' label='Value' name='user_content' icon='person' defaultValue={props.data.get('user_content')} onChange={props.onUserInputChange}/>
                </InputCol>
                <DropDownCol>
                    <Dropdown
                        auto
                        label='Action'
                        name='user_action'
                        className='matInput'
                        onChange={props.onUserDropDownChange}
                        source={dropdownValues()}
                        value={props.data.get('user_action')}
                    />
                </DropDownCol>
            </Row>
            {bots()}
            <Button icon='add' floating accent mini label='+' onClick={props.handleAddNewBotRow} />
            <br/>
            <br/>
            <Button flat primary raised className='tree-submit-btn' label='Save node' type='submit' />
        </form>
    );
};

export default Popup;