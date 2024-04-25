import { LinkSimple } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";



export default function TransferLiveAgentUILoading() {
    return <div className="grid gap-2 rounded-2xl border border-zinc-200 bg-white p-2 sm:p-4">

        <div className="font-medium text-xl">Sending request to live agent</div>
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />

    </div>


}