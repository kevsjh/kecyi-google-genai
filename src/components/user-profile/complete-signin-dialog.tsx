'use client'

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
import { useAuthContext } from "@/context/auth-context"
import { useMediaQuery } from "@/hooks/use-media-query"
import React, { use, useEffect, useState } from "react"
import { Icons } from "../icon"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { signInWithEmailLink } from "firebase/auth"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

function UsernameForm({ className, setOpen }: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    className?: string
}) {
    const [loading, setLoading] = useState(false)
    const { auth } = useAuthContext()
    const router = useRouter()

    const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            const email = e.currentTarget.email.value
            // validate email
            if (!email) {
                toast.error('Email is required')
                return
            }
            setLoading(true)
            const actionCodeSettings = {
                url: window.location.href,
                handleCodeInApp: true,
            }
            const response = await signInWithEmailLink(auth, email);
            setLoading(false)
            toast.success('Email sent successfully')
            router.push('/')
        } catch (err) {
            console.error(`Failed to send email: ${err}`)
            setLoading(false)
        }
    }




    return <form
        onSubmit={handleEmailLogin}
        className={cn("grid items-start gap-4", className)}>
        <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="newroom@example.com" />
        </div>
        <Button type="submit"
            disabled={loading}
            className="flex gap-2 items-center rounded-lg bg-secondary hover:bg-secondary hover:opacity-80 text-primary">
            Continue with Email
        </Button>
    </form>

}


export function CompleteSignInDialog() {
    const { auth, pendingAuthState } = useAuthContext()
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const searchParams = useSearchParams()

    const router = useRouter()

    async function handleCompleteSignIn() {
        try {
            let emailFromStrorage = window.localStorage.getItem("emailForSignIn");
            if (emailFromStrorage === null) {
                return
            }
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
            if (!emailRegex.test(emailFromStrorage)) {
                toast.error('Invalid email format')
                return
            }
            const response = await signInWithEmailLink(auth, emailFromStrorage);


            toast.success('Signed in successfully')
            setOpen(false)
            router.push('/')
        } catch (err) {
            console.error(`Failed to sign in: ${err}`)


        }
    }


    useEffect(() => {

        if (!pendingAuthState) {

            const completesignup = searchParams.get('completesignup')

            if (completesignup !== 'true') {
                return
            }

            if (auth.currentUser === null) {
                setOpen(true)
                handleCompleteSignIn()
                return
            }
            // clean up any leftover search param
            router.push('/')

        }

    }, [searchParams, pendingAuthState, auth.currentUser])

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>

                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] ">
                    <DialogHeader className="flex flex-col gap-2 items-center justify-center">
                        <Icons.Logo className="w-8 h-8 fill-primary" />
                        <DialogTitle className="text-primary">Get Started in Seconds</DialogTitle>
                        <DialogDescription className="text-center">
                            Use your email or social sign in to create a free account.
                        </DialogDescription>
                    </DialogHeader>
                    <UsernameForm setOpen={setOpen} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild >

            </DrawerTrigger>
            <DrawerContent className="pb-4">
                <DrawerHeader className="text-center flex flex-col gap-2 items-center">
                    <Icons.Logo className="w-8 h-8 fill-primary" />
                    <DrawerTitle>Get Started in Seconds</DrawerTitle>
                    <DrawerDescription>
                        Use your email or social sign in to create a free account.
                    </DrawerDescription>
                </DrawerHeader>
                <UsernameForm className="px-4" setOpen={setOpen} />


            </DrawerContent>
        </Drawer>
    )
}



