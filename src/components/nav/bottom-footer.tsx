import Link from "next/link";
import { Icons } from "../icon";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";

export default function BottomFooter() {
    return <div className="bg-indigo-purple w-full py-6   rounded-t-3xl">
        <div className="px-6 md:container w-full  ">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full items-center" >

                <div className="flex col-span-1  flex-col gap-2">
                    <Link href={'/'} className="flex items-center gap-2 text-primary text-2xl font-medium">
                        <Icons.Logo className="w-8 h-8 fill-primary" />
                        newroom
                    </Link>
                    <p className="text-primary">AI Interior Design Assistant</p>

                    <div className="text-sm">
                        ©{new Date().getFullYear()} NewroomCo. All Rights Reserved.
                    </div>

                    <Link
                        className="text-sm"
                        href={"/terms"}>
                        Terms and Conditions
                    </Link>
                    <div className="w-fit flex items-start flex-col  gap-1">
                        <div className="text-primary  text-start  text-sm ">Member of</div>
                        <div className="w-40  ">
                            <img
                                className="object-cover  drop-shadow-md"
                                src="/assets/gcp-logo.png"
                                alt='google'
                            />
                        </div>
                    </div>

                </div>

                {/* <div className="flex flex-col justify-end  h-full items-center gap-2">
                    <div className="flex gap-1 items-center">Made with ❤️<Icons.Avatar className="w-14 h-14 " /></div>
                </div> */}
                <div className="col-span-1 flex flex-col  justify-end  h-full  items-start sm:items-end gap-1 ">


                    <Link
                        target="_blank"
                        href={"https://www.instagram.com/newroom.io"}>
                        <InstagramLogo size={35} />
                    </Link>

                    <Link href={'/pricing'} className="font-medium">Pricing</Link>
                    <a className="font-medium " href="#tally-open=wkyrMr&tally-emoji-text=👋&tally-emoji-animation=wave">Contact Us</a>
                    <div className="flex gap-1 items-center ">
                        <Link
                            target="_blank"
                            href={'https://twitter.com/kevinsmjh'}> <Icons.Avatar className="w-12 h-12  " /></Link> Made with ❤️
                    </div>


                </div>

            </div>

        </div>
    </div>
}