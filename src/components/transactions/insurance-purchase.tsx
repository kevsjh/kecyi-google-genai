'use client'

import { useEffect, useId, useState } from 'react'
import { useActions, useAIState, useUIState } from 'ai/rsc'
import { formatNumber } from '@/lib/utils'

import type { StockAgentAI } from '@/lib/chat/stock-agent-ai-actions'
import { IUserInsuranceData } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowCircleDown } from '@phosphor-icons/react'
import { TransactionCopilotAI } from '@/lib/chat/transaction-copilot-actions'
import { toast } from 'sonner'
import { Badge } from '../ui/badge'




const insurances = [
  {
    title: 'Travel Insurance',
    key: 'travel',
    basicAmount: 100,
    premiumAmount: 500,

  },
  {
    title: 'Life Insurance',
    key: 'life',
    basicAmount: 500,
    premiumAmount: 1500,


  }
]

interface IInsurancePurchaseProps {


  status: 'requires_action' | 'completed' | 'expired' | 'error'
  currentInsurance: IUserInsuranceData[]
  error?: string
}


export function InsurancePurchase({
  props: { currentInsurance, error, status = 'requires_action' }
}: {
  props: IInsurancePurchaseProps
}) {
  // const [value, setValue] = useState(numberOfShares || 100)
  const [purchasingUI, setPurchasingUI] = useState<null | React.ReactNode>(null)
  const [aiState, setAIState] = useAIState<typeof TransactionCopilotAI>()
  const [, setMessages] = useUIState<typeof TransactionCopilotAI>()
  const { confirmInsurancePurchase } = useActions()
  const [showTravelPremium, setShowTravelPremium] = useState(false)
  const [showLifePremium, setShowLifePremium] = useState(false)
  const [travelInsurance, setTravelInsurance] = useState<'none' | 'basic' | 'premium'>('none')
  const [lifeInsurance, setLifeInsurance] = useState<'none' | 'basic' | 'premium'>('none')
  // Unique identifier for this UI component.
  const id = useId()


  useEffect(() => {
    // check if user already has insurance with the premium type, and set state accordingly
    const travelInsurance = currentInsurance.find(ins => ins.insuranceType === 'travel')
    const lifeInsurance = currentInsurance.find(ins => ins.insuranceType === 'life')
    if (travelInsurance) {
      setTravelInsurance(travelInsurance.premium ? 'premium' : 'basic')
    }
    if (lifeInsurance) {
      setLifeInsurance(lifeInsurance.premium ? 'premium' : 'basic')
    }


  }, [currentInsurance])

  // Whenever the slider changes, we need to update the local value state and the history
  // so LLM also knows what's going on.
  // function onSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   const newValue = Number(e.target.value)
  //   setValue(newValue)

  //   // Insert a hidden history info to the list.
  //   const message = {
  //     role: 'system' as const,
  //     content: `[User has changed to purchase ${newValue} shares of ${symbol}. Total cost: $${(
  //       newValue * price
  //     ).toFixed(2)}]`,

  //     // Identifier of this UI component, so we don't insert it many times.
  //     id
  //   }

  //   // If last history state is already this info, update it. This is to avoid
  //   // adding every slider change to the history.
  //   if (aiState.messages[aiState.messages.length - 1]?.id === id) {
  //     setAIState({
  //       ...aiState,
  //       messages: [...aiState.messages.slice(0, -1), message]
  //     })
  //     return
  //   }
  //   // If it doesn't exist, append it to history.
  //   setAIState({ ...aiState, messages: [...aiState.messages, message] })
  // }
  return (
    <div className="grid gap-2 rounded-2xl border border-zinc-200 bg-white p-2 sm:p-4">
      <div className="grid gap-2 sm:flex sm:flex-row justify-between border-b p-2">
        <div className="sm:basis-1/4">

          <div className="font-medium">Insurance</div>
        </div>

      </div>
      {purchasingUI ? (
        <div className="mt-4 text-zinc-200">{purchasingUI}</div>
      ) : status === 'requires_action' ? (
        <div className="grid gap-3">
          {
            <div
              className="flex cursor-pointer flex-row items-start sm:items-center gap-4 rounded-xl p-2 hover:bg-zinc-50"

            >
              <div className="grid gap-4 grid-cols-6 items-start sm:gap-6 flex-1">
                <div className="col-span-2">
                  <div className="font-medium text-sm">
                    Type
                  </div>

                </div>
                <div className="col-span-1">
                  <div className="font-medium text-sm">
                    Premium
                  </div>

                </div>
                <div className="col-span-2 flex justify-center">
                  <div className="sm:text-center text-sm font-medium">
                    💲
                  </div>

                </div>

                <div className="col-span-1 flex justify-center">
                  🧧

                </div>
              </div>
            </div>
          }


          {
            insurances.map(insurance => (
              <div
                key={insurance.key}
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
                <div className="grid gap-4 grid-cols-6 items-start sm:gap-6 flex-1">
                  <div className="col-span-2 flex flex-col">
                    <div className="font-medium text-sm">
                      {insurance.title}

                    </div>

                    {
                      insurance.key === 'travel' ? travelInsurance !== 'none' && <Badge
                        variant='outline'
                        className='w-fit'>{travelInsurance}</Badge> :
                        lifeInsurance !== 'none' && <Badge
                          variant='outline'
                          className='w-fit'>{lifeInsurance}</Badge>
                    }

                  </div>
                  <div className="col-span-1 ">
                    <div className=" ">

                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className='flex text-sm items-center gap-1 px-2 py-0.5 rounded-xl border'


                        >  {
                            insurance.key === 'travel' ? showTravelPremium ? 'Premium' : 'Basic' : showLifePremium ? 'Premium' : 'Basic'
                          } <ArrowCircleDown size={20} /> </DropdownMenuTrigger>
                        <DropdownMenuContent>

                          <DropdownMenuItem

                            onClick={() => {
                              insurance.key === 'travel' ? setShowTravelPremium(false) : setShowLifePremium(false)

                            }}

                          >Basic</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              insurance.key === 'travel' ? setShowTravelPremium(true) : setShowLifePremium(true)

                            }}
                          >Premium</DropdownMenuItem>

                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {/* <div className="text-sm text-zinc-600">
                    {departingAirport} - {arrivalAirport}
                  </div> */}
                  </div>
                  <div className="col-span-2 flex flex-col items-center">
                    <div className="sm:text-center text-sm font-medium font-mono">
                      ${
                        insurance.key === 'travel' ? showTravelPremium ? insurance.premiumAmount : insurance.basicAmount : showLifePremium ? insurance.premiumAmount : insurance.basicAmount
                      } SGD
                    </div>

                  </div>
                  <div className="col-span-1 flex justify-center">
                    <div className="text-sm">
                      {
                        (insurance.key === 'travel' ? travelInsurance !== 'premium' : lifeInsurance !== 'premium') && <button

                          disabled={insurance.key === 'travel' ? travelInsurance === 'premium' : lifeInsurance === 'premium'}
                          className='px-2 py-0,5 border shadow-sm rounded-md'

                          onClick={async () => {


                            if (insurance.key === 'travel' ? travelInsurance === 'premium' : lifeInsurance === 'premium') {
                              return
                            }

                            // get the premium
                            const premium: boolean = insurance.key === 'travel' ? showTravelPremium : showLifePremium

                            // get the price
                            const price = premium ? insurance.premiumAmount : insurance.basicAmount

                            // check if this insurance already exists in currentInsurance
                            const existingId = currentInsurance.find(ins => ins.insuranceType === insurance.key)?.id
                            const existingIndex = currentInsurance.findIndex(ins => ins.insuranceType === insurance.key);

                            if (existingId && existingIndex !== -1) {
                              // check if it's the same premium
                              const currentInsurancePremium = currentInsurance[existingIndex].premium
                              if (currentInsurancePremium === premium) {
                                toast.info('You already have this insurance type')
                                return
                              }
                            }



                            const response = await confirmInsurancePurchase(
                              premium, price, insurance.key, existingId
                            )
                            setPurchasingUI(response.purchasingUI)
                            // Insert a new system message to the UI.
                            setMessages((currentMessages: any) => [
                              ...currentMessages,
                              response.newMessage
                            ])

                          }}

                        >
                          {
                            insurance.key === 'travel' ? travelInsurance === 'premium' ?
                              'Purchased' : travelInsurance === 'basic' ? 'Upgrade' : 'Buy'
                              : lifeInsurance === 'premium' ? 'Purchased' : lifeInsurance === 'basic' ? 'Upgrade' : 'Buy'
                          }
                        </button>
                      }
                    </div>

                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : status === 'completed' ? (
        <p className="mb-2 text-primary">
          Insurace purchased successfully.
        </p>
      ) : status === 'error' ? (
        <p className="mb-2 text-primary">
          Insurance purchased failed. {error ?? 'Something went wrong. Please try again later'}
        </p>
      ) : status === 'expired' ? (
        <p className="mb-2 text-primary">Your checkout session has expired!</p>
      ) : null}


    </div>
  )

}
