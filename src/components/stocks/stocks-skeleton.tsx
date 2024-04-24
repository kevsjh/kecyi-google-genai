import { Skeleton } from "../ui/skeleton"

export const StocksSkeleton = () => {
  return (
    <div className="mb-4 flex flex-col gap-2 overflow-y-scroll pb-4 text-sm sm:flex-row">
      <Skeleton className="max-w-full sm:w-[208px] w-full h-[60px]" />
      <Skeleton className="max-w-full sm:w-[208px] w-full h-[60px]" />
      <Skeleton className="max-w-full sm:w-[208px] w-full h-[60px]" />
      {/* <div className="flex h-[60px] w-full shadow-md cursor-pointer flex-row gap-2 rounded-xl bg-white p-2 text-left hover:bg-white/80 sm:w-[208px]">
        
      </div>
      <div className="flex h-[60px] w-full shadow-md cursor-pointer flex-row gap-2 rounded-xl bg-white p-2 text-left hover:bg-white/80 sm:w-[208px]"></div>
      <div className="flex h-[60px] w-full shadow-md  cursor-pointer flex-row gap-2 rounded-xl bg-white p-2 text-left hover:bg-white/80 sm:w-[208px]"></div> */}
    </div>
  )
}
