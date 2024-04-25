import EmbedPDFViewer from "@/components/embed-pdf-viewer"
import { getContentById } from "@/lib/auth/admin-action"
import { ArrowCircleLeft } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function Page({ params }: {
    params: {
        id: string

    }
}) {
    const { objectURL } = await getContentById(params.id)

    if (objectURL === undefined) {
        notFound()
    }


    return <div className="flex flex-col gap-2 w-full h-full">
        <div className="flex justify-start px-4 py-2">
            <Link href={'/admin/knowledge'}>
                <ArrowCircleLeft size={30} />
            </Link>

        </div>

        <EmbedPDFViewer blobURL={objectURL}
        />

    </div>
}