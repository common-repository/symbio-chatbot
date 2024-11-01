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

    @-webkit-keyframes line{
        0%{
        
            background-color: rgba(255,255,255, 1);
            box-shadow: 12px 0px 0px 0px rgba(255,255,255,1), 
                        24px 0px 0px 0px rgba(255,255,255,1);
                        
        }
        25%{ 
                background-color: rgba(255,255,255, 1);
                box-shadow: 12px 0px 0px 0px rgba(255,255,255,1), 
                        24px 0px 0px 0px rgba(255,255,255,1);
                        
        }
        75%{ background-color: rgba(255,255,255, 1);
            box-shadow: 12px 0px 0px 0px rgba(0,0,0,0.2), 
                        24px 0px 0px 0px rgba(0,0,0,2);
                    
        }
    }

    @-moz-keyframes line{
        0%{
        
            background-color: rgba(255,255,255, 1);
            box-shadow: 12px 0px 0px 0px rgba(0,0,0,0.2), 
                        24px 0px 0px 0px rgba(0,0,0,0.2);
                        
        }
        25%{ 
                background-color: rgba(255,255,255, 1);
                box-shadow: 12px 0px 0px 0px rgba(0,0,0,2), 
                        24px 0px 0px 0px rgba(0,0,0,0.2);
                        
        }
        75%{ background-color: rgba(255,255,255, 1);
            box-shadow: 12px 0px 0px 0px rgba(0,0,0,0.2), 
                        24px 0px 0px 0px rgba(0,0,0,2);
                    
        }
    }

    @keyframes line{
        0%{
        
            background-color: rgba(255,255,255, 1);
            box-shadow: 12px 0px 0px 0px rgba(255,255,255,1), 
                        24px 0px 0px 0px rgba(255,255,255,1);
                        
        }
        25%{ 
                background-color: rgba(255,255,255, 1);
                box-shadow: 12px 0px 0px 0px rgba(255,255,255,1), 
                        24px 0px 0px 0px rgba(255,255,255,1);
                        
        }
        75%{ background-color: rgba(255,255,255, 1);
            box-shadow: 12px 0px 0px 0px rgba(255,255,255,1), 
                        24px 0px 0px 0px rgba(255,255,255,1);
                    
        }
    }

    body {
        font-family: 'Open Sans','Arial','sans-serif';
        width: 100vw;
        height: 100vh;
    }
`;
