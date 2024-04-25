import Link from "next/link";
import { Icons } from "../icon";
import UserProfile from "../user-profile";
import { Suspense } from "react";
import { Smiley } from "@phosphor-icons/react/dist/ssr";




export default function TopNav() {
    return <div className=" my-3     z-50  w-full fixed top-0 flex justify-center  ">
        <div className="w-full max-w-screen-2xl px-6 md:container  ">
            <nav className="   shadow-md z-50  justify-between px-6 flex items-center w-full py-3 bg-slate-500 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30  ">
                <Link href={'/'} className="flex items-center gap-2 text-secondary text-2xl font-medium">

                    <div className="flex bg-primary p-2 items-center justify-center gap-2 rounded-full">
                        <Smiley size={20} color='white' className="transition-all group-hover:scale-110" />
                    </div>
                    genai.kecyi.com</Link>

                <div className="flex space-x-2 items-center text-white">
                    <Link href={'/pricing'} className="
                    bg-secondary text-primary rounded-lg px-3 py-1
                    hidden sm:inline-flex">Pricing</Link>

                    <Suspense  >
                        {/* <div className="hidden md:inline-block ">  <UserPlanDisplay /></div> */}

                        <UserProfile />
                    </Suspense>


                </div>
            </nav>
        </div>
        {/* <nav className="py-4  backdrop-blur-md background-opacity-10 rounded-lg max-w-screen-lg  w-full bg-white/30 ">Top Nav</nav> */}
    </div>
}