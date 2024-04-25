import { getAuthByCookie } from "@/lib/auth/action"
import { redirect } from "next/navigation"

export default async function Page() {
    const session = await getAuthByCookie()
    if (!session?.user) {
        redirect(`/?signin=true`)
    }


    return <div className="flex h-full p-4 flex-col ">
        Live Agent
    </div>
}