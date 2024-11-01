import React from 'react';
import styled from 'styled-components';
import { media } from '_utils/mixins';

const VideoWrapper = styled.div`
     position: relative;
     padding-top: 10px;
     margin: 0 auto 20px;
     width: 100%;
     max-width: 960px;
    ${ media.tablet`
        padding-top: 0;
        margin: 0 auto 30px;
    `}

    iframe {
        width: 100% !important;
        height: auto !important;
        min-height: 200px !important;
        ${ media.tablet`
            height: 350px !important;
        `}
    }
`;

const Video = (props) => {
    const regexp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = props.url.match(regexp);
    const videoId = match && match[2].length == 11 ? match[2] : '';

    return (
        <VideoWrapper>
            <iframe width="560" height="315" src={'https://www.youtube.com/embed/' + videoId} frameBorder={0} allowFullScreen></iframe>
        </VideoWrapper>
    );
};

export default Video;