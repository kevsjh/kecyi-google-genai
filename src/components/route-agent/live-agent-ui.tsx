import { LinkSimple } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

interface IProps {

    clientPath: string;
    adminPath: string;

}

export default function TransferLiveAgentUI({ props: { clientPath, adminPath } }: {
    props: IProps
}) {
    return <div className="grid gap-2 rounded-2xl border border-zinc-200 bg-white p-2 sm:p-4">
        <div className="font-medium text-xl">Continue to Live Agent</div>

        <Link href={clientPath} className="text-sm  border px-2 py-1 rounded-lg shadow-md flex gap-1 w-fit items-center">
            Navigate to client live agent conversation <LinkSimple size={18} />
        </Link>

        <Link target="_blank" href={adminPath} className="text-sm  border px-2 py-1 rounded-lg shadow-md flex gap-1 w-fit items-center">
            Open admin live agent tab to start conversation <LinkSimple size={18} />
        </Link>
    </div>


}