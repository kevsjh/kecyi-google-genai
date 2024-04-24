'use client'

import * as React from "react"


import { cn, createUrl } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "../icon"
import { CheckFat, GithubLogo, GoogleLogo } from "@phosphor-icons/react"
import { useAuthContext } from "@/context/auth-context"
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { set } from "firebase/database"
import { toast } from "sonner"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { CompleteSignInDialog } from "./complete-signin-dialog"






function LoginForm({ setOpen, className }: {
    className?: string
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const [loading, setLoading] = React.useState(false)
    const { auth, passwordlessSignIn } = useAuthContext()
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const [emailSent, setEmailSent] = React.useState(false)

    function onDialogToggle(open: boolean) {
        if (open) {
            setOpen(true)
        } else {
            router.refresh()
            setOpen(false)
            const optionSearchParams = new URLSearchParams(searchParams.toString());
            optionSearchParams.delete('signin')
            const optionUrl = createUrl(pathname, optionSearchParams);
            router.replace(optionUrl, { scroll: false });

        }
    }


    async function handleEmailLogin(e: React.FormEvent<HTMLFormElement>) {
        try {
            e.preventDefault()
            const email = e.currentTarget.email.value
            // validate email
            if (!email) {
                toast.error('Email is required')
                return
            }
            // validate email regex
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
            if (!emailRegex.test(email)) {
                toast.error('Invalid email format')
                return
            }
            setLoading(true)
            await passwordlessSignIn(email)
            const optionSearchParams = new URLSearchParams(searchParams.toString());
            optionSearchParams.delete('signin')
            const optionUrl = createUrl(pathname, optionSearchParams);
            router.replace(optionUrl, { scroll: false });

            setLoading(false)
            setEmailSent(true)
            // await passwordlessSignIn()
        } catch (err) {
            console.log(`Email Login Failed, Error: ${err}`)
            setLoading(false)
            toast.error('Something went wrong, please try again')
        }
    }

    async function handleGoogleLogin() {
        if (auth.currentUser) return;
        const provider = new GoogleAuthProvider();
        try {
            setLoading(true)
            const loggedInUser = await signInWithPopup(auth, provider);

            onDialogToggle(false);

            setLoading(false)

            const optionSearchParams = new URLSearchParams(searchParams.toString());
            optionSearchParams.delete('signin')
            const optionUrl = createUrl(pathname, optionSearchParams);
            router.replace(optionUrl, { scroll: false });
            router.refresh()
        } catch (err) {
            setLoading(false)
            // console.log(`Google Login Failed, Error: ${err}`)
            // toast.error('Something went wrong, please try again')

        }
    }

    async function handleGithubLogin() {
        if (auth.currentUser) return;
        const provider = new GithubAuthProvider();
        try {
            setLoading(true)
            const loggedInUser = await signInWithPopup(auth, provider);

            onDialogToggle(false);

            setLoading(false)

            const optionSearchParams = new URLSearchParams(searchParams.toString());
            optionSearchParams.delete('signin')
            const optionUrl = createUrl(pathname, optionSearchParams);
            router.replace(optionUrl, { scroll: false });
            router.refresh()
        } catch (err) {
            setLoading(false)
            // console.log(`Google Login Failed, Error: ${err}`)
            // toast.error('Something went wrong, please try again')
        }
    }

    if (emailSent) {
        return <div className="flex text-center flex-col gap-4 items-center">
            <div className="p-3 rounded-lg bg-primary">
                <CheckFat size={40} weight="fill" className="fill-white" />
            </div>
            <p className="font-medium text-sm">
                An email has been sent to your email address. Please check your email to continue.
            </p>

            <button
                className="w-full py-2 px-3 rounded-xl text-white bg-primary"
                onClick={() => {
                    setOpen(false)
                    setEmailSent(false)
                }}
            >Close</button>

        </div>
    }


    return (
        <form
            onSubmit={handleEmailLogin}
            className={cn("grid items-start gap-4", className)}>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" placeholder="newroom@example.com" />
            </div>
            <Button type="submit"
                disabled={loading}
                className="flex gap-2 rounded-lg items-center bg-secondary hover:bg-secondary hover:opacity-80 text-primary">
                Continue with Email</Button>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-primary border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <Button type="button"
                disabled={loading}
                onClick={handleGoogleLogin}
                className="flex gap-2 items-center rounded-lg">
                <GoogleLogo size={20} weight="bold" />
                Continue with Google</Button>

            <Button type="button"
                disabled={loading}
                onClick={handleGithubLogin}
                className="flex gap-2 items-center rounded-lg">
                <GithubLogo size={20} weight="bold" />
                Continue with GitHub</Button>
        </form>
    )
}


export function UserLoginDialog() {
    const { auth } = useAuthContext()
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const searchParam = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()


    function onDialogToggle(open: boolean) {
        if (open) {
            setOpen(true)
        } else {
            router.refresh()
            setOpen(false)
            const optionSearchParams = new URLSearchParams(searchParams.toString());
            optionSearchParams.delete('signin')
            const optionUrl = createUrl(pathname, optionSearchParams);
            router.replace(optionUrl, { scroll: false });

        }



    }


    React.useEffect(() => {
        const signinParam = searchParam.get('signin')

        if (signinParam === 'true') {
            setOpen(true)
        }


    }, [searchParam])


    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onDialogToggle}


            >
                <DialogTrigger asChild>
                    <Button variant={'secondary'}
                        className="hover:bg-secondary hover:bg-opacity-80   transform transition duration-200 
                        sm:hover:scale-125  rounded-lg"
                    >
                        Login
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] ">
                    <DialogHeader className="flex flex-col gap-2 items-center justify-center">
                        <Icons.Logo className="w-8 h-8 fill-primary" />
                        <DialogTitle className="text-primary">Get Started in Seconds</DialogTitle>

                    </DialogHeader>
                    <LoginForm setOpen={setOpen} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={onDialogToggle}>
            <DrawerTrigger asChild >
                <Button variant={'secondary'}
                    className="hover:bg-secondary hover:bg-opacity-80   transform transition duration-200 
                        sm:hover:scale-125 rounded-lg"
                >
                    Login
                </Button>
            </DrawerTrigger>
            <DrawerContent className="pb-4">
                <DrawerHeader className="text-center flex flex-col gap-2 items-center">
                    <Icons.Logo className="w-8 h-8 fill-primary" />
                    <DrawerTitle>Get Started in Seconds</DrawerTitle>

                </DrawerHeader>
                <LoginForm className="px-4" setOpen={setOpen} />
            </DrawerContent>
        </Drawer>
    )
}


export default function LoginDialog() {
    return <>

        <React.Suspense>
            <UserLoginDialog />
        </React.Suspense>
    </>
}

