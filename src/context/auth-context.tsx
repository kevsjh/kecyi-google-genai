"use client";

export const maxDuration = 60; // Applies to the actions


import {
    onAuthStateChanged,
    getAuth,
    User,
    Auth,
    sendSignInLinkToEmail,
    updateProfile,
} from "firebase/auth";

import {

    firebaseAuth,
    firebaseFirestore,

} from "@/config/firebase-config";

import { Timestamp, Unsubscribe, doc, onSnapshot } from "firebase/firestore";
import React, { useCallback, useEffect } from "react";

import { siteConfig } from "@/config/site-config";

import { toast } from "sonner";

import { onSignInRequest, onSignOutRequest, populateUserData } from "@/lib/auth/action";


interface IAuthContext {

    auth: Auth;
    pendingAuthState: boolean;
    passwordlessSignIn(email: any): Promise<{
        result: void | null;
        error: unknown;
    }>;
    updateUserProfile(name: string): Promise<void>;


    totalCredits: number;
    creditRefreshesAt: string | undefined;

    // subscription details
    subscriptionStatus: string | null;
    subscriptionCurrentPeriodStart: Timestamp | null;
    subscriptionCurrentPeriodEnd: Timestamp | null;
    subscriptionCancelAt: Timestamp | null;
    currentProductName: string | null;
    currentProductImages: string[];
    subscriptionEndedAt: Timestamp | null;
    userReferralLink: string;
    userReferralCount: number;
    invokeUserSignOut(): Promise<void>

}


const AuthContext = React.createContext<IAuthContext>({

    auth: firebaseAuth,
    pendingAuthState: true,
    passwordlessSignIn: async () => {
        return { result: null, error: null };
    },
    updateUserProfile: async () => {
        return;
    },

    totalCredits: 0,
    subscriptionStatus: null,
    subscriptionCurrentPeriodStart: null,
    subscriptionCurrentPeriodEnd: null,
    subscriptionCancelAt: null,
    currentProductName: null,
    currentProductImages: [],
    subscriptionEndedAt: null,
    userReferralLink: "",
    userReferralCount: 0,
    creditRefreshesAt: undefined,
    invokeUserSignOut: async () => {
        return;
    },
});



export const AuthContextProvider = ({ children }: { children: any }) => {

    const [pendingAuthState, setPendingAuthState] = React.useState(true);



    const [totalCredits, setTotalCredits] = React.useState(0);

    const [subscriptionCurrentPeriodStart, setSubscriptionCurrentPeriodStart] =
        React.useState<Timestamp | null>(null);

    const [subscriptionCurrentPeriodEnd, setSubscriptionCurrentPeriodEnd] =
        React.useState<Timestamp | null>(null);

    const [subscriptionStatus, setSubscriptionStatus] = React.useState<string | null>(
        null
    );
    const [subscriptionCancelAt, setSubscriptionCancelAt] =
        React.useState<Timestamp | null>(null);
    const [currentProductName, setCurrentProductName] = React.useState<string | null>(
        null
    );
    const [currentProductImages, setCurrentProductImages] = React.useState<string[]>(
        []
    );
    const [subscriptionEndedAt, setSubscriptionEndedAt] =
        React.useState<Timestamp | null>(null);

    const [userReferralLink, setUserReferralLink] = React.useState<string>("");
    const [userReferralCount, setUserReferralCount] = React.useState<number>(0);
    const [creditRefreshesAt, setCreditRefreshesAt] = React.useState<
        string | undefined
    >(undefined);


    const auth = firebaseAuth;

    async function invokeUserSignOut() {
        await auth.signOut()

        await onSignOutRequest()

        return
    }

    // auth helper function
    async function passwordlessSignIn(email: any) {


        // referral=GVcK2ZmkbeVxiZC4JeU9

        let url = `${siteConfig.url}?completesignup=true`;
        // if (referralParam) {
        //     if (referralParam.length > 0) {
        //         url += "&referral=" + referralParam;
        //     }
        // }

        const actionCodeSettings = {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            url: url,
            // This must be true.
            handleCodeInApp: true,
        };
        let result = null,
            error = null;
        try {
            result = await sendSignInLinkToEmail(
                auth,
                email,
                actionCodeSettings
            ).then(() => {
                // The link was successfully sent. Inform the user.
                // Save the email locally so you don't need to ask the user for it again
                // if they open the link on the same device.
                localStorage.setItem("emailForSignIn", email);
                // ...
            });
        } catch (e) {
            error = e;
        }

        return { result, error };
    }

    async function validateUserProfile(uid: string) {
        try {

            // server action request to set cookie
            const idToken = await auth.currentUser?.getIdToken()

            if (!idToken) {
                toast.error(`Login failed`)
                // force signout
                await auth.signOut()
                return
            }


            const status = await onSignInRequest({ idToken: idToken })

            if (!status) {
                toast.error(`Login failed`)
                // force signout
                await auth.signOut()
                return
            }

            const response = await populateUserData()


        } catch (err) {
            console.log("Failed to validate user profile", err);
            toast.error(`Login failed`)
            // force signout
            await auth.signOut()
        }
    }


    async function updateUserProfile(name: string) {
        if (auth.currentUser === null) {
            return;
        }

        try {
            await updateProfile(auth.currentUser, {
                displayName: name,
            });
        } catch (err) {
            console.error(`Failed to update user profile, ${err} `);

        }
    }


    const handleUserSignout = useCallback(async () => {

        // only handle user sign out request if pending auth state is false
        if (!pendingAuthState) {
            console.log('signout request')
            await onSignOutRequest()

        }

        setPendingAuthState(false);
    }, [auth.currentUser, pendingAuthState]);

    const handleOnUserSignin = useCallback(async () => {

        if (auth.currentUser === null) {

            setPendingAuthState(false);
            return;
        }
        try {
            await validateUserProfile(auth.currentUser.uid);

            setPendingAuthState(false);

        } catch (err) {
            toast.error("Failed to sign in")
            setPendingAuthState(false);
            console.log("Failed to handle user sign in", err);
        }
    }, [auth.currentUser, pendingAuthState]);




    useEffect(() => {
        if (!pendingAuthState && auth.currentUser === null) {
            handleUserSignout();
        }

    }, [pendingAuthState, auth.currentUser])





    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            if (user === null) {

                console.log('user is null')
                await handleUserSignout();
                setPendingAuthState(false);
                return;
            }

            await handleOnUserSignin();
            setPendingAuthState(false);
        });

        return () => {
            // redirectResultHandler();
            unsubscribe();
        };
    }, []);




    return (
        <AuthContext.Provider
            value={{

                auth,
                pendingAuthState,
                passwordlessSignIn,
                updateUserProfile,
                totalCredits,


                subscriptionStatus,
                subscriptionCurrentPeriodStart,
                subscriptionCurrentPeriodEnd,
                subscriptionCancelAt,
                currentProductName,
                currentProductImages,
                subscriptionEndedAt,
                userReferralLink,
                userReferralCount,
                creditRefreshesAt,
                invokeUserSignOut
            }}

        >
            {children}
        </AuthContext.Provider>
    );

}

export const useAuthContext = () => React.useContext(AuthContext);