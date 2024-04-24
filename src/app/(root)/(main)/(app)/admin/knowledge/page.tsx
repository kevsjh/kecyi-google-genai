import { AddContentDialog } from "./components/add-content-dialog";

export default function Page() {
    return <div className="flex  flex-col h-full p-6   w-full">
        <div className="flex items-center justify-between"><h1 className="text-3xl font-semibold">Knowledge Hub</h1>
            <AddContentDialog />

        </div>

        <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-6">

        </div>
    </div>
}