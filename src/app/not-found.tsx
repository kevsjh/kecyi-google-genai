import BottomFooter from "@/components/nav/bottom-footer";
import TopNav from "@/components/nav/top-nav";
import { Seal } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex  flex-col w-full justify-between items-center  h-dvh ">

      <div className="  h-full w-full ">
        <TopNav />
        <div className=" w-full justify-center items-center  mx-auto flex px-6 md:container   flex-col h-full ">
          <div className="h-full  w-full flex flex-col gap-4 justify-center text-center items-center">
            <Seal size={72} weight="bold" className="fill-white" />
            <p className="text-white text-7xl font-medium">404</p>
            <p className="text-white text-7xl font-medium">Not Found</p>
            <p className="text-white text-lg">
              Oops the page you are looking for does not exist
            </p>
            <Link href={'/'} className="bg-secondary text-primary px-6 py-4 rounded-lg text-2xl font-medium">Home</Link>
          </div>
        </div>
      </div>
      <BottomFooter />
    </div>
  );
}
