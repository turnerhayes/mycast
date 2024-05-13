"use client";

import { PropsWithChildren } from "react";
import {
    ApolloLink,
    HttpLink,
  } from "@apollo/client";
  import {
    ApolloNextAppProvider,
    NextSSRApolloClient,
    NextSSRInMemoryCache,
    SSRMultipartLink,
  } from "@apollo/experimental-nextjs-app-support/ssr";

  function makeClient() {
    const httpLink = new HttpLink({
        uri: "https://api.taddy.org",
        headers: {
          "X-USER-ID": "1341",
          "X-API-KEY": "09f4cb99e2d49236fd528e613d087662743eca4d3e98f972e1ed316e741156d847959e0e37adf21e24c9294db0b0b79956",
        }
    });
  
    return new NextSSRApolloClient({
      cache: new NextSSRInMemoryCache(),
      link:
        typeof window === "undefined"
          ? ApolloLink.from([
              new SSRMultipartLink({
                stripDefer: true,
              }),
              httpLink,
            ])
          : httpLink,
    });
  }
  
  export function ApolloWrapper({ children }: PropsWithChildren) {
    return (
      <ApolloNextAppProvider makeClient={makeClient}>
        {children}
      </ApolloNextAppProvider>
    );
  }
