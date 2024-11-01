import React from 'react';
import styled from 'styled-components';
import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';

const FormContainer = styled.div`
    width: 100%;
    height: 52px;
    float: right;
    position: relative;
    color: #333;
    margin-bottom: 100px;
`;

const FormElement = styled.form`
    display: block;
    width: 100%;
    height: 100%;
    border-bottom: 1px solid #333;
`;

const Form = (props) => {
    const placeholder = props.placeholder ? props.placeholder : 'Type your name here...';
    return (
        <FormContainer>
            <FormElement onSubmit={(e) => {props.onSubmit(e, props.nextNodeId, props.treeId);}}>
                <Input placeholder={placeholder} onChange={props.onInputChange}/>
                <Button baseUrl={props.baseUrl}/>
            </FormElement>
        </FormContainer>
    );
};

export default Form;