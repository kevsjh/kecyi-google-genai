'use client'

import { AuthContextProvider, useAuthContext } from "@/context/auth-context";
import LoginDialog, { UserLoginDialog } from "./user-login-dialog";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { use, useEffect } from "react";
import { CompleteSignInDialog } from "./complete-signin-dialog";
import { createUrl } from "@/lib/utils";



export default function UserProfile() {
    const { auth, pendingAuthState, invokeUserSignOut } = useAuthContext()
    // const searchParams = useSearchParams()
    // const router = useRouter()
    // const pathname = usePathname()


    // async function handleSignoutParam() {
    //     if (!pendingAuthState) {
    //         const optionSearchParams = new URLSearchParams(searchParams.toString());
    //         optionSearchParams.delete('signout')
    //         const param = searchParams.get('signout')
    //         if (param === 'true') {
    //             invokeUserSignOut()


    //         }
    //         const optionUrl = createUrl(pathname, optionSearchParams);
    //         router.replace(optionUrl, { scroll: false });
    //     }
    // }




    // useEffect(() => {
    //     if (!pendingAuthState) {

    //         handleSignoutParam()
    //     }


    // }, [searchParams, pendingAuthState])


    return <div className="">
        <>

            <CompleteSignInDialog />
            {
                auth.currentUser ?
                    <></> :
                    <LoginDialog />
            }
        </>
    </div>


}


