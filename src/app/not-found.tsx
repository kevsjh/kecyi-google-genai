import { AppHeader } from "@/components/nav/app-header";
import { Seal } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex  flex-col w-full justify-between items-center  h-full ">

      <div className="  h-full w-full ">
        <AppHeader />
        <div className=" w-full justify-center items-center  mx-auto flex px-6 md:container   flex-col h-full ">
          <div className="h-full  w-full flex flex-col gap-4 justify-center text-center items-center">
            <Seal size={72} weight="bold" className="fill-white" />
            <p className="text-primary text-7xl font-medium">404</p>
            <p className="text-primary text-7xl font-medium">Not Found</p>
            <p className="text-primary text-lg">
              Oops the page you are looking for does not exist
            </p>
            <Link href={'/'} className="bg-primary text-white px-8 py-2 rounded-lg text-base font-medium">Home</Link>
          </div>
        </div>
      </div>

    </div>
  );
}
