

import { Sidebar } from '@/components/nav/sidebar'
import { ILiveAgentDoc } from '@/types'
import React from 'react'
import AdminInboxItem from './admin-inbox-item'


export async function AdminInboxSidebar({ liveAgentDocs }: {

  liveAgentDocs: ILiveAgentDoc[]

}) {
  return (
    <Sidebar className="peer  absolute inset-y-0 z-10 hidden -translate-x-full border-r duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[220px]">
      <div className='px-2 py-2 flex flex-col gap-2'>
        {
          liveAgentDocs.map((liveAgentDoc, i) => (

            <AdminInboxItem key={i}
              id={liveAgentDoc.id}
              status={liveAgentDoc.status}
              summarizeChat={liveAgentDoc.summarizeChat}

            />
          ))
        }
      </div>

    </Sidebar>
  )
}
