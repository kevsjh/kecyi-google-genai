import { getLiveAgentChats } from "@/lib/live-agent-actions/live-agent-actions";

export default async function InboxPage() {
    const liveAgentDocs = await getLiveAgentChats()

    return <div className="group  w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[200px] ">
        {liveAgentDocs.map((liveAgentDoc) => {
            return <div key={liveAgentDoc.id}>
                <h1>{liveAgentDoc.id}</h1>
                <p>{liveAgentDoc.summarizeChat}</p>
            </div>
        })}

    </div>

}