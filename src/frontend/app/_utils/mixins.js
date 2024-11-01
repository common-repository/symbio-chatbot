import { css } from 'styled-components';

export const media = {
    tablet: (...args) => css`
        @media (min-width: 760px) {
            ${ css(...args) }
        }
    `,
    desktop: (...args) => css`
        @media (min-width: 1024px) {
            ${ css(...args) }
        }
    `
};