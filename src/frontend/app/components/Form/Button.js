import React from 'react';
import styled from 'styled-components';
import submit_btn from '../../_assets/svg/outbox.svg';
import { media } from '_utils/mixins';

const ButtonWrapper = styled.button`
    width: 20%;
    float: right;
    font-size: 17px;
    line-height: 52px;
    text-transform: uppercase;
    color: inherit;
    font-family: "Hind", sans-serif;
    border: 0;
    background: transparent;
    cursor: pointer;
    padding-top: 15px;
    padding-left: 10px;

    img {
        width: 20px;
        height: auto;
        ${ media.tablet`
            width: 35px;
        `}
    }

    &:focus {
        outline: 0;
    }

    ${ media.tablet`
        padding-top: 10px;
    `}
`;

const Button = (props) => {
    return (
        <ButtonWrapper>
            <img src={props.baseUrl + submit_btn}/>
        </ButtonWrapper>
    );
};

export default Button;