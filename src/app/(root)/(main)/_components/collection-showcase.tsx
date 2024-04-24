
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const cards = [
    {
        id: 1,
        className: " col-span-1 md:col-span-2",
        thumbnail: "/assets/collection-placeholder/1-min.png",
    },
    {
        id: 2,

        className: "col-span-1",
        thumbnail: "/assets/collection-placeholder/2-min.png",
    },
    {
        id: 3,

        className: "col-span-1",
        thumbnail: "/assets/collection-placeholder/3-min.png",
    },
    {
        id: 4,

        className: "col-span-1 md:col-span-2",
        thumbnail: "/assets/collection-placeholder/4-min.png",
    },
    {
        id: 5,

        className: "col-span-1 md:col-span-2",
        thumbnail: "/assets/collection-placeholder/5-min.png",
    },
    {
        id: 6,

        className: "col-span-1",
        thumbnail: "/assets/collection-placeholder/6-min.png",
    },
];


export default function CollectionShowcase() {
    return <div className="flex flex-col gap-4 w-full justify-center items-center text-white text-center">
        <Badge className="w-fit border-secondary py-2 font-normal rounded-lg">Collections</Badge>
        <p className="text-center text-5xl  font-medium">Collections Showcase</p>
        <p className="text-lg text-center font-light">Get inspired! <br />See how others elevate designs with NewRoom</p>
        <div className="flex justify-center py-4">
            <Link href={"/collections"} className="hover:bg-secondary px-6 py-5 font-medium text-xl rounded-lg bg-custom text-primary">
                View collections
            </Link>
        </div>

        <div className="w-full h-full py-2 ">
            <div className=" grid grid-cols-1 md:grid-cols-3    max-w-7xl mx-auto w-full h-full gap-6">
                {cards.map((item, i) => (
                    <div
                        key={i}
                        className={cn(
                            "relative overflow-hidden min-h-[384px] h-full w-full rounded-lg aspect-video shadow-md",
                            // if even number, set col-span-3
                            item.className
                        )}
                    >
                        <img
                            alt={`collection-${i + 1}`}
                            className="h-full w-full object-cover aspect-[4/4] "
                            src={item.thumbnail}
                        // fill
                        />

                    </div>
                ))}
            </div>
        </div>
    </div>
}