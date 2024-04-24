"use client";


import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useAuthContext } from "./auth-context";
import { createUrl } from "@/lib/utils";


const HandleURLParamContext = React.createContext({

})
export const HandleURLParamProvider = ({ children }: { children: any }) => {


    const { auth, invokeUserSignOut, pendingAuthState } = useAuthContext()
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()


    async function handleSignoutParam() {
        if (!pendingAuthState) {
            const optionSearchParams = new URLSearchParams(searchParams.toString());
            optionSearchParams.delete('signout')
            const param = searchParams.get('signout')
            if (param === 'true') {
                invokeUserSignOut()


            }
            const optionUrl = createUrl(pathname, optionSearchParams);
            router.replace(optionUrl, { scroll: false });
            router.refresh()
        }
    }

    useEffect(() => {
        if (!pendingAuthState) {

            handleSignoutParam()
        }
    }, [searchParams, pendingAuthState])

    return (
        <HandleURLParamContext.Provider
            value={{}}

        >
            {children}
        </HandleURLParamContext.Provider>)

}
export const useHandleURLParam = () => React.useContext(HandleURLParamContext);