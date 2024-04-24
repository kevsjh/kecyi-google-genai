'use client'

import { IUserStockPortfolio } from '@/types'
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { useActions, useUIState } from 'ai/rsc'
import { Skeleton } from '../ui/skeleton'


export const ListStockPortfolioSkeleton = () => {



  return (
    <div className="grid gap-2 rounded-2xl border border-zinc-200 bg-white p-2 sm:p-4">
      <div className="grid gap-2 sm:flex sm:flex-row justify-between border-b p-2">
        <div className="sm:basis-1/4">

          <div className="font-medium">Current Portfolio</div>
        </div>

      </div>
      <div className="grid gap-3">
        <div
          className="flex cursor-pointer flex-row items-start sm:items-center gap-4 rounded-xl p-2 hover:bg-zinc-50">
          <div className="grid gap-4 grid-cols-3 items-start sm:gap-6 flex-1">
            <div className="col-span-1">
              <Skeleton className="w-20 h-4 rounded-lg   text-lg text-transparent" />
            </div>
            <div>
              <div className="font-medium">
                <Skeleton className="w-12 h-4 rounded-lg   text-lg text-transparent" />

              </div>
              {/* <div className="text-sm text-zinc-600">
                    {departingAirport} - {arrivalAirport}
                  </div> */}
            </div>
            <div className='flex items-end flex-col gap-2'>
              <div className="sm:text-right  items-end justify-end font-medium font-mono">
                <Skeleton className="w-12 h-4 rounded-lg   text-lg text-transparent" />

              </div>
              <div className="sm:text-right justify-end text-xs text-zinc-600">
                <Skeleton className="w-8 h-4 rounded-lg   text-lg text-transparent" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex cursor-pointer flex-row items-start sm:items-center gap-4 rounded-xl p-2 hover:bg-zinc-50">
          <div className="grid gap-4 grid-cols-3 items-start sm:gap-6 flex-1">
            <div className="col-span-1">
              <Skeleton className="w-20 h-4 rounded-lg   text-lg text-transparent" />
            </div>
            <div>
              <div className="font-medium">
                <Skeleton className="w-12 h-4 rounded-lg   text-lg text-transparent" />

              </div>
              {/* <div className="text-sm text-zinc-600">
                    {departingAirport} - {arrivalAirport}
                  </div> */}
            </div>
            <div className='flex items-end flex-col gap-2'>
              <div className="sm:text-right  items-end justify-end font-medium font-mono">
                <Skeleton className="w-12 h-4 rounded-lg   text-lg text-transparent" />

              </div>
              <div className="sm:text-right justify-end text-xs text-zinc-600">
                <Skeleton className="w-8 h-4 rounded-lg   text-lg text-transparent" />
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex cursor-pointer flex-row items-start sm:items-center gap-4 rounded-xl p-2 hover:bg-zinc-50">
          <div className="grid gap-4 grid-cols-3 items-start sm:gap-6 flex-1">
            <div className="col-span-1">
              <Skeleton className="w-20 h-4 rounded-lg   text-lg text-transparent" />
            </div>
            <div>
              <div className="font-medium">
                <Skeleton className="w-12 h-4 rounded-lg   text-lg text-transparent" />

              </div>
              {/* <div className="text-sm text-zinc-600">
                    {departingAirport} - {arrivalAirport}
                  </div> */}
            </div>
            <div className='flex items-end flex-col gap-2'>
              <div className="sm:text-right  items-end justify-end font-medium font-mono">
                <Skeleton className="w-12 h-4 rounded-lg   text-lg text-transparent" />

              </div>
              <div className="sm:text-right justify-end text-xs text-zinc-600">
                <Skeleton className="w-8 h-4 rounded-lg   text-lg text-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
