import React from 'react';
import styled from 'styled-components';

const LinkWrapper = styled.a`
    font-weight: 300;
    font-family: "Roboto Slab", serif;
    width: auto;
    font-size: 16px;
    color: #fff;
`;

const Link = (props) => {
    return (
        <LinkWrapper href={props.url} target='_blank'>{props.url}</LinkWrapper>
    );
};

export default Link;