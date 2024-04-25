
import { useAuthContext } from '@/context/auth-context'
import { Sidebar } from './sidebar'
import { ChatHistory } from './chat-history'
import { getAuth } from 'firebase-admin/auth'
import { getAuthByCookie } from '@/lib/auth/action'
import { redirect } from 'next/navigation'
import { getClientChatsByAgentChatType } from '@/lib/helper-actions/action'
import { isAgentChatTypeValid } from '@/lib/utils'
import { AgentChatTypeEnum } from '@/constant/enum'
import { ILiveAgentDoc } from '@/types'


export async function AdminInboxSidebar({ liveAgentDocs }: {

  liveAgentDocs: ILiveAgentDoc[]

}) {

  const session =
    await getAuthByCookie()


  if (!session || !session?.user?.id) {
    redirect('/?signin=true')
  }


  return (


    <Sidebar className="peer  absolute inset-y-0 z-10 hidden -translate-x-full border-r duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[200px]">
      {
        liveAgentDocs.map((liveAgentDoc, i) => (
          <div key={i}>
            <h1>{liveAgentDoc.id}</h1>
          </div>
        ))
      }

    </Sidebar>
  )
}
