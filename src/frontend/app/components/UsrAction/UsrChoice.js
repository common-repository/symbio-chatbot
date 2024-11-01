import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import { media } from '_utils/mixins';

const Choice = styled.button`
    display: inline-block;
    padding: 12px 10px 9px 10px;
    text-transform: uppercase;
    font-family: "Hind", sans-serif;
    font-weight: 400;
    cursor: pointer;
    color: ${props => props.type === 'positive' ? '#' + props.colorData.pos_choice_fg : '#' + props.colorData.neg_choice_fg};
    background-color: ${props => props.type === 'positive' ? '#' + props.colorData.pos_choice_bg : '#' + props.colorData.neg_choice_bg};
    border: ${props => props.type === 'positive' ? '1px solid #' + props.colorData.pos_choice_bc : '1px solid #' + props.colorData.neg_choice_bc};
    transition: all 300ms ease;
    margin: 10px 0 0 0;
    font-size: 13px;

    ${ media.tablet`
        margin: 0 0 0 10px;
        padding: 17px 20px 14px 20px;
        font-size: 16px;
    `}

    &:hover {
        background-color: ${props => props.type === 'positive' ? props.hoverBg : ''};
        border: ${props => props.type === 'positive' ? '1px solid' + props.hoverBg : ''};
    }

    &:focus {
        outline: 0;
    }
`;

const UsrChoice = (props) => {
    const bgColor = props.type === 'positive' ? `#${props.colorData.pos_choice_bg}` : `#${props.colorData.neg_choice_bg}`;
    const hoverBg = darken(0.1, bgColor);

    return (
        <Choice {...props} hoverBg={hoverBg}>{props.children}</Choice>
    );
};

export default UsrChoice;
