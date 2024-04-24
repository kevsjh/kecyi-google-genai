'use client'

import { Button } from "@/components/ui/button";
import { createUrl } from "@/lib/utils";
import { XCircle } from "@phosphor-icons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import path from "path";
import { useEffect, useState } from "react";



export default function CloseCopilotButton() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()



    function onClose() {

        const optionSearchParams = new URLSearchParams(searchParams.toString());
        optionSearchParams.delete('copilot')
        const optionUrl = createUrl(pathname, optionSearchParams);
        router.replace(optionUrl, { scroll: false });
    }



    return <Button

        onClick={onClose}
        size='icon'
        variant={'ghost'}>
        <XCircle size={25} />
    </Button>
}