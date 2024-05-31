import { styled } from "@mui/material";

export const ChangeOnHover = styled('div')({
    '&:not(:hover) > .hovered': {
        display: 'none',
    },

    '&:hover': {
        '> :not(.hovered)': {
            display: 'none',
        }
    }
});
