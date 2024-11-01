import React from 'react';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import {Row, InputCol, DropDownCol, DelBotRowBtn} from 'components/_Tree/styles';
import FontIcon from 'react-toolbox/lib/font_icon';

const BotRow = (props) => {
    return (
        <Row>
            <InputCol>
                <Input type='text' name='bot_value' label='Value' className='matInput' icon='android' defaultValue={props.value} onChange={(value) => {props.onBotInputChange(props.index, value);}}/>
            </InputCol>
            <DropDownCol>
                <Dropdown
                    auto
                    label='Action'
                    name='bot_action'
                    className='matInput'
                    onChange={(value) => {props.onBotDropDownChange(props.index, value);}}
                    source={[
                        { value: 'text', label: 'Text' },
                        { value: 'variable', label: 'Text with name variable (use [:name])' },
                        { value: 'image', label: 'Image' },
                        { value: 'link', label: 'Link' },
                        { value: 'video', label: 'YT Video' }
                    ]}
                    value={props.action_value}
                />
            </DropDownCol>
            <DelBotRowBtn onClick={() => {props.handleRemoveBotRow(props.rowId);}}>
                <FontIcon value='clear'/>
            </DelBotRowBtn>
        </Row>
    );
};

export default BotRow;