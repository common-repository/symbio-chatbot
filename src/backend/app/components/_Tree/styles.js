import styled from 'styled-components';

export const VerticalLine = styled.div`
    height: 43px;
    width: 0px;
    position: relative;
    border-left: 2px dotted #ffffff;
    float: left;
`;

export const NodeRow = styled.div`
    width: 100%;
    float: left;
`;

export const NodeContent = styled.div`
    float: left;
    margin: 10px;
    width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const ControlElements = styled.div`
    text-align: right;
    height: 30px;
`;

export const EditBtn = styled.button`
    width: 20px;
    height: 20px;
    background-size: 16px;
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    margin-left: 10px;
`;

export const Row = styled.div`
    display: flex;
    flex-flow: wrap row;
    position:
`;

export const InputCol = styled.div`
    order: 1;
    width: 70%;
    padding-right: 30px;
`;

export const DropDownCol = styled.div`
    order: 2;
    width: 25%;
`;

export const DelBotRowBtn = styled.button`
    order: 3;
    width: 5%;
    cursor: pointer;
    border: 0;
    background-color: transparent;
    padding-bottom: 10px;
    &:focus {
        outline: 0;
    }
`;