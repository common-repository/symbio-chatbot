import React from 'react';
import styled from 'styled-components';
import { media } from '_utils/mixins';

const InputWrapper = styled.input`
    width: 80%;
    height: 100%;
    padding: 0 20px;
    border: 0;
    font-size: 15px;
    font-weight: 300;
    line-height: 52px;
    color: inherit;
    background-color: transparent;
    &:focus {
        outline: 0;
    }

    -webkit-input-placeholder {
        opacity: 0.5;
    }

    -moz-placeholder {
        opacity: 0.5;
    }

    -ms-input-placeholder {
        opacity: 0.5;
    }

    &:placeholder {
        opacity: 0.5;
    }

    ${ media.tablet`
        font-size: 20px;
    `}
`;

const Input = (props) => {
    return (
        <InputWrapper type='text' maxLength={20} placeholder={props.placeholder} onChange={props.onChange} value={props.value}/>
    );
};

export default Input;