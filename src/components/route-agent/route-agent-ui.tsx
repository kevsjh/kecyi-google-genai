import { LinkSimple } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

interface IProps {

    path: string;
    name: string
}

export default function RouteAgentUI({ props: { path, name } }: {
    props: IProps
}) {
    return <div className="grid gap-2 rounded-2xl border border-zinc-200 bg-white p-2 sm:p-4">
        <div className="font-medium text-xl">Continue to {name}</div>

        <Link href={path} className="text-sm  border px-2 py-1 rounded-lg shadow-md flex gap-1 w-fit items-center">Navigate to {name?.toLowerCase()}

            <LinkSimple size={18} />
        </Link>
    </div>


}