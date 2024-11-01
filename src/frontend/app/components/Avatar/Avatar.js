import React from 'react';
import styled from 'styled-components';
import { media } from '_utils/mixins';

const Name = styled.span`
    font-size: 12px;
    color: #333;
    font-weight: 300;
    ${ media.desktop`
        margin-top: 5px;
        font-size: 17px;
        line-height: 1;
        white-space: nowrap;
    `}
`;

const Image = styled.img`
    width: 100%;
    height: 40px;
    border-radius: 70px;
    overflow: hidden;
    margin-bottom: 2px !important;
    ${ media.tablet`
        height: 70px;
        margin-bottom: 15px !important;
    `}
`;

const Container = styled.div`
    width: 40px;
    position: absolute;
    left: 0;
    bottom: -22px;
    text-align: center;
    ${ media.tablet`
        width: 70px;
    `}
`;

const Avatar = ({image, name}) => {
    return (
        <Container>
            <Image src={image} alt={name} />
            <Name>{name}</Name>
        </Container>
    );
};

export default Avatar;
