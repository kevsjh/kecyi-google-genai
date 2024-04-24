
import { useAuthContext } from '@/context/auth-context'
import { Sidebar } from './sidebar'
import { ChatHistory } from './chat-history'
import { getAuth } from 'firebase-admin/auth'
import { getAuthByCookie } from '@/lib/auth/action'
import { redirect } from 'next/navigation'
import { getClientChatsByAgentChatType } from '@/lib/helper-actions/action'
import { isAgentChatTypeValid } from '@/lib/utils'
import { AgentChatTypeEnum } from '@/constant/enum'


export async function ClientSidebarDesktop({ params }: {
  params: {
    agent: string
  }

}) {


  const isValid = isAgentChatTypeValid(params.agent)
  if (!isValid) {
    redirect('/client')
  }


  const session =
    await getAuthByCookie()


  if (!session || !session?.user?.id) {
    redirect('/?signin=true')
  }


  return (
    <Sidebar className="peer  absolute inset-y-0 z-10 hidden -translate-x-full border-r duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">

      <ChatHistory
        agentChatType={params.agent as AgentChatTypeEnum}
        userId={session.user.id} />
    </Sidebar>
  )
}
