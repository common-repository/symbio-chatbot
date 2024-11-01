import React from 'react';
import styled from 'styled-components';
import image_bubble from '../../_assets/svg/bubble-arrow--dark.svg';
import { media } from '_utils/mixins';

const BubbleWrapper = styled.p`
    position:relative;
    display: inline-block !important;
    margin-bottom: 0 !important;
    padding: 10px 15px 12px 15px !important;
    border-radius: 5px;
    clear: both;
    line-height: 1.4 !important;
    color: ${props => props.bot ? '#' + props.colorData.bot_bubble_fg : '#' + props.colorData.usr_bubble_fg};
    background-color: ${props => props.bot ? '#' + props.colorData.bot_bubble_bg : '#' + props.colorData.usr_bubble_bg};
    float: ${props => props.bot ? 'left' : 'right'};
    margin-right: ${props => props.bot ? '26px !important' : '0'};

    ${ media.tablet`
        margin-bottom: 10px !important;
        padding: 23px 30px 25px 30px !important;
    `}
`;

const AvatarBubbleWrapper = BubbleWrapper.extend`
    &:before {
        content: '';
        display: none;
        width: 26px;
        height: 56px;
        position: absolute;
        bottom: 5px;
        left: -22px;
        background-color: ${props => '#' + props.colorData.bot_bubble_bg};
        -webkit-mask-image: url('${props => props.baseUrl ? props.baseUrl + image_bubble : image_bubble}');
        mask-image: url('${props => props.baseUrl ? props.baseUrl + image_bubble : image_bubble}');
        background-size: contain;
        ${ media.tablet`
            display: inline-block;
        `}
    }
`;

const Bubble = (props) => {
    const row = props.avatar ? <AvatarBubbleWrapper {...props}>{props.children}</AvatarBubbleWrapper> : <BubbleWrapper {...props}>{props.children}</BubbleWrapper>;
    return row;
};

Bubble.defaultProps = {
    bot: false
};

export default Bubble;
