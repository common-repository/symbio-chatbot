import React from 'react';
import styled from 'styled-components';
import mute_image from '../../_assets/svg/mute.svg';
import { media } from '_utils/mixins';

const MuteContainer = styled.div`
    position: fixed;
    display: flex;
    z-index: 100;
    height: 45px;
    right: 25px;
    bottom: 25px;
    border: 1px solid #FF6600;
    border-radius: 100px;
    background-color: #FF6600;
    transition: width 350ms ease;

    ${ media.tablet`
        right: 40px;
        bottom: 40px;
    `}
`;

const InfoText = styled.div`
    padding: 11px 0 0 0;
    font-weight: 300;
    font-family: "Roboto Slab", serif;
    font-size: 12px !important;
    color: #FFFFFF;
    transition: all 400ms ease;
    max-width: ${props => props.showText ? '200px' : '0'};
    white-space: nowrap;
    overflow: hidden;
    span {
        display: inline-block;
        padding: 0 0 0 15px;
    }
`;

const MuteSymbol = styled.span`
    position:relative;
    cursor: pointer;
    width: 45px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    &:before {
        content: '';
        display: block;
        width: 20px;
        height: 22px;
        background: url('${props => props.baseUrl ? props.baseUrl + mute_image : mute_image}');
        margin: 0 0 2px 0;
    }
    &:after {
        content: '';
        position: absolute;
        top: -5px;
        right: -5px;
        left: -5px;
        bottom: -5px;
    }
`;

const MuteBtn = (props) => {
    return (
        <MuteContainer {...props}>
            <InfoText {...props}><span>{props.mute ? props.textOff : props.textOn}</span></InfoText>
            <MuteSymbol {...props} onClick={props.handleMute}/>
        </MuteContainer>
    );
};

export default MuteBtn;