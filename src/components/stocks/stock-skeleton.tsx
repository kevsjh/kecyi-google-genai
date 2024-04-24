import { Skeleton } from "../ui/skeleton"

export const StockSkeleton = () => {
  return (
    <div className="rounded-xl border shadow-md border-primary bg-white p-4 text-green-400">

      <Skeleton className="float-right inline-block w-12 h-4  rounded-full px-2 py-1 text-xs text-transparent"

      />
      {/* <div className="float-right inline-block w-fit rounded-full bg-zinc-700 px-2 py-1 text-xs text-transparent">
        xxxxxxx
      </div> */}

      <Skeleton className="mb-1 w-12 h-8 rounded-lg   text-lg text-transparent"

      />


      <Skeleton className="mb-1 w-20 h-6 rounded-lg   text-lg text-transparent"

      />


      <Skeleton className="mb-1 w-48 max-w-full h-4 rounded-lg   text-lg text-transparent"

      />




      <div className="relative -mx-4 cursor-col-resize">
        <div style={{ height: 146 }}></div>
      </div>
    </div>
  )
}
