import { cn } from "@/lib/utils";

export function FlipCard({
    firstChildren,
    secondChildren,
    className,
}: {
    firstChildren: React.ReactNode;

    secondChildren: React.ReactNode;
    className?: string;
}) {

    return (
        <div className={cn("group/item w-full  [perspective:1000px]", className)}>
            <div className="relative h-full w-full transition-all duration-500   
            [transform-style:preserve-3d] 
            group-hover/item:[transform:rotateY(180deg)]">
                <div className="absolute w-full inset-0">
                    {firstChildren}
                </div>
                <div className="absolute inset-0 h-full w-full 
                  [transform:rotateY(180deg)]  
                  [backface-visibility:hidden]">
                    {secondChildren}
                </div>
            </div>
        </div>
    );
}