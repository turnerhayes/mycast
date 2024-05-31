import { ReactNode } from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";

export const BaseLink = (
    props: NextLinkProps & MuiLinkProps & {
        children: ReactNode;
    }
) => {
    return (
        <MuiLink
            component={NextLink}
            {...props}
        >
            {props.children}
        </MuiLink>
    );
}
