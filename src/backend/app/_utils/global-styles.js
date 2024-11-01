import { injectGlobal } from 'styled-components';

export default injectGlobal`
    * , *:before , *:after {
        box-sizing: border-box;
    }

    * {
        margin: 0;
        padding: 0;
    }

    @-ms-viewport {
        width: device-width;
    }

    html {
        font-size: 100%;
        line-height: 1.5;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        touch-action: manipulation;
    }

    body {
        font-family: 'Open Sans','Arial','sans-serif';
        width: 100vw;
        height: 100vh;
        align-items: center;
        justify-content: center;
    }

    .node-image {
        float: left;
        margin: 9px 5px;
        color: #000000;
    }

    .modal-dialog {
        overflow-y: scroll !important;
    }

    .tree {
        max-width: 1980px;
        overflow-x: scroll;
    }

    .tree .parent {
        padding-top: 20px; position: relative;
        display: flex;
        justify-content: space-between;
        transition: all 0.5s;
        -webkit-transition: all 0.5s;
        -moz-transition: all 0.5s;
    }

    .tree .parent .parent::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        border-left: 1px solid #ccc;
        width: 0;
        height: 20px;
    }

    .tree > .parent {
        padding-right: 10px;
    }

    .tree .child {
        text-align: center;
        list-style-type: none;
        position: relative;
        padding: 20px 0 0 10px;

        transition: all 0.5s;
        -webkit-transition: all 0.5s;
        -moz-transition: all 0.5s;
    }

    .tree .child:first-of-type {
        padding: 20px 0 0 0
    }

    .tree .child::before, .tree .child::after {
        content: '';
        position: absolute;
        top: 0;
        right: 50%;
        border-top: 1px solid #ccc;
        width: 50%; height: 20px;
    }
    .tree .child::after {
        right: auto; left: 50%;
        border-left: 1px solid #ccc;
    }

    .tree .child:only-child::after, .tree .child:only-child::before {
        display: none;
    }

    .tree .child:only-child {
         padding-top: 0;
    }

    .tree .child:first-child::before, .tree .child:last-child::after {
        border: 0 none;
    }

    .tree .child:last-child::before {
        border-right: 1px solid #ccc;
        border-radius: 0 5px 0 0;
        -webkit-border-radius: 0 5px 0 0;
        -moz-border-radius: 0 5px 0 0;
    }

    .tree .child:first-child::after {
        border-radius: 5px 0 0 0;
        -webkit-border-radius: 5px 0 0 0;
        -moz-border-radius: 5px 0 0 0;
    }

    .matInput input, .matInput input:focus {
        box-shadow: none;
        border-bottom: 1px solid rgba(0,0,0,.12);
        border-left: 0;
        border-right: 0;
        border-top: 0;
        background-color: #ffffff;
    }

    .tree-submit-btn {
        background: #0085ba !important;
        border-color: #0085ba !important;
        border-radius: 3px !important;
        padding: 0 12px 2px;
    }
`;
