import React from 'react';
import FontIcon from 'react-toolbox/lib/font_icon';
import {EditBtn} from 'components/_Tree/styles';

const CreateButton = (props) => {
    return (
        <EditBtn onClick={() => { props.onClick(props.path); }}>
            <span>
                <FontIcon value='add' />
            </span>
        </EditBtn>
    );
};

export default CreateButton;