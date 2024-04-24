'use client'

import { IUserStockPortfolio } from '@/types'
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { useActions, useUIState } from 'ai/rsc'


interface IProps {

  portfolios: IUserStockPortfolio[]
}




export const ListStockPortfolio = ({ props: { portfolios } }: {
  props: IProps
}) => {

  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState()


  return (
    <div className="grid gap-2 rounded-2xl border border-zinc-200 bg-white p-2 sm:p-4">
      <div className="grid gap-2 sm:flex sm:flex-row justify-between border-b p-2">
        <div className="sm:basis-1/4">

          <div className="font-medium">Current Portfolio</div>
        </div>

      </div>
      <div className="grid gap-3">
        {
          portfolios.length > 0 && <div
            className="flex cursor-pointer flex-row items-start sm:items-center gap-4 rounded-xl p-2 hover:bg-zinc-50"

          >
            <div className="grid gap-4 grid-cols-5 items-start sm:gap-6 flex-1">
              <div className="col-span-1">
                <div className="font-medium text-sm">
                  Symbol
                </div>

              </div>
              <div className="col-span-2">
                <div className="font-medium text-sm">
                  Stock Price
                </div>

              </div>
              <div className="col-span-2 flex justify-end">
                <div className="sm:text-right text-sm font-medium">
                  Total Stock Amount
                </div>

              </div>
            </div>
          </div>
        }

        {portfolios &&

          portfolios.map(portflio => (
            <div
              key={portflio.id}
              className="flex cursor-pointer flex-row items-start sm:items-center gap-4 rounded-xl p-2 hover:bg-zinc-50"
            // onClick={async () => {
            //   const response = await submitUserMessage(
            //     `The user has selected flight ${flight.airlines}, departing at ${flight.departureTime} and arriving at ${flight.arrivalTime} for $${flight.price}. Now proceeding to select seats.`
            //   )
            //   setMessages((currentMessages: any[]) => [
            //     ...currentMessages,
            //     response
            //   ])
            // }}
            >
              <div className="grid gap-4 grid-cols-5 items-start sm:gap-6 flex-1">
                <div className="col-span-1">
                  <div className="font-medium">
                    {portflio.symbol}
                  </div>

                </div>
                <div className="col-span-2 ">
                  <div className="font-medium font-mono">
                    ${portflio.price} USD
                  </div>
                  {/* <div className="text-sm text-zinc-600">
                    {departingAirport} - {arrivalAirport}
                  </div> */}
                </div>
                <div className="col-span-2 flex flex-col items-end">
                  <div className="sm:text-right font-medium font-mono">
                    ${portflio.amount} SGD
                  </div>
                  <div className=" justify-end flex gap-1 items-center sm:text-right text-xs text-zinc-600">
                    <p className='text-xs'>Total Shares</p>   {portflio.numberOfShares}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
