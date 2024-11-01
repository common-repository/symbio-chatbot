import React from 'react';
import styled from 'styled-components';
import { media } from '_utils/mixins';

const LoaderContainer = styled.div`
    border: 1px solid black;
    width: 100px;
    height: 35px;
    border-radius: 5px;
    text-align: center;
    background-color: ${props => '#' + props.colorData.bot_bubble_bg};

    ${ media.tablet`
        height: 50px;
    `}
`;

const Loading = styled.div`
    margin: 13px 33px;
    width: 6px;
    height: 6px;
    -webkit-animation: line 1s linear infinite alternate;
    -moz-animation: line 1s linear infinite alternate;
    animation: line 1s linear infinite alternate;
    ${ media.tablet`
        margin: 20px 35px;
    `}
`;

const Loader = (props) => {
    return (
        <LoaderContainer {...props}>
            <Loading/>
        </LoaderContainer>
    );
};

export default Loader;