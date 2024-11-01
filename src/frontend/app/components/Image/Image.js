import React from 'react';
import styled from 'styled-components';

const ImageWrapper = styled.div`
    text-align: center;
    img {
        width: 100%;
        max-width: 400px;
        height: auto;
        margin: auto;
        display: block;
    } 
`;

const Image = (props) => {
    return (
        <ImageWrapper>
            <img src={props.url} alt='chatbot-img'/>
        </ImageWrapper>
    );
};

export default Image;