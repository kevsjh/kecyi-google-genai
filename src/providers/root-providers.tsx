"use client";

import React, { Suspense } from "react"; import { AuthContextProvider } from "@/context/auth-context";
import { ThemeProvider } from 'next-themes'
import { HandleURLParamProvider } from "@/context/handle-url-param-context";

type Props = {
  children: React.ReactNode;
};

const RootProviders = ({ children, ...props }: {
  children: React.ReactNode;


}) => {
  return (
    // <AuthContextProvider>
    <Suspense>
      <HandleURLParamProvider>
        <ThemeProvider defaultTheme="light" forcedTheme="light">
          {children}
        </ThemeProvider>
      </HandleURLParamProvider>
    </Suspense>
    // </AuthContextProvider>
  );
};

export default RootProviders;
