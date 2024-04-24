'use client'

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { Button } from "@/components/ui/button";
import { createUrl } from "@/lib/utils";
import { Sparkle, XCircle } from "@phosphor-icons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";



export default function ToggleCopilot({ showText }: {
    showText?: boolean
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [enable, setEnable] = useState(true)

    function onToggle() {

        const optionSearchParams = new URLSearchParams(searchParams.toString());
        optionSearchParams.set('copilot', 'true')
        const optionUrl = createUrl(pathname, optionSearchParams);
        router.replace(optionUrl, { scroll: false });
    }

    useEffect(() => {

        const copilotParam = searchParams.get('copilot')
        if (copilotParam?.toLowerCase() === 'true') {
            setEnable(false)
        } else {
            setEnable(true)
        }


    }, [searchParams])


    return <div className="flex items-center gap-2">
        {
            (enable && showText) && <p className="hidden md:inline-block text-sm ">Get help from Copilot</p>
        }

        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild><Button
                    disabled={!enable}
                    onClick={onToggle}
                    size='icon'
                    variant={'ghost'}>
                    <Sparkle size={20} />
                </Button></TooltipTrigger>
                <TooltipContent>
                    <p>Get Help from Copilot</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
}