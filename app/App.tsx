"use client";

import { ReactNode } from "react";
import { ApolloWrapper } from "@/app/data/podcasts_client";

export const App = (
    {
        children,
    }: {
        children: ReactNode;
    }
) => {
    return (
        <ApolloWrapper>
            {children}
        </ApolloWrapper>
    );
};
