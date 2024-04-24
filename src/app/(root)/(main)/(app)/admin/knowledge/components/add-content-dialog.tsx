'use client'

export const maxDuration = 180;

import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { loadPDFAction } from "@/lib/vector-search/load-pdf"
import { uploadPDFObject } from "@/lib/storage/upload-storage-object"
import { useAuthContext } from "@/context/auth-context"




/**
 * Adds content main body
 * @param {
 *     selectedFile,
 *     setSelectedFile,
 *     className,
 *     selectedTab,
 *     setSelectedTab
 * 
 * } 
 * @returns  
 */
function AddContentMainBody({
    selectedFile,
    setSelectedFile,
    className,
    selectedTab,
    setSelectedTab,
    url,
    setURL


}: {
    url: string
    setURL: React.Dispatch<string>
    selectedFile: File | undefined
    setSelectedFile: React.Dispatch<File | undefined>
    className?: string
    selectedTab: 'PDF' | 'URL'
    setSelectedTab: React.Dispatch<React.SetStateAction<'PDF' | 'URL'>>
}) {

    return <div className={className}>
        <Tabs

            value={selectedTab}
            onValueChange={(e) => {
                setSelectedTab(e as 'PDF' | 'URL');
            }}
            defaultValue="PDF" className="w-full">
            <TabsList className="w-full">
                <TabsTrigger className="w-full" value="PDF">PDF</TabsTrigger>
                <TabsTrigger className="w-full" value="URL">URL</TabsTrigger>
            </TabsList>
            <TabsContent value="PDF">
                <div className="w-full">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="pdf">PDF File</Label>
                        <Input id="pdf" type="file"
                            multiple={false}
                            accept="application/pdf"
                            onChange={(e) => {
                                const selFile = e.target.files?.[0]
                                // make sure file does not exceed 3mb
                                if (selFile && selFile.size > 5 * 1024 * 1024) {
                                    toast.error("File size exceeds 5mb")
                                    return
                                }
                                // make sure the file is pdf
                                if (selFile && selFile.type !== "application/pdf") {
                                    toast.error("File must be a PDF")
                                    return
                                }
                                setSelectedFile(selFile)
                            }}
                        />
                    </div>
                    <Label htmlFor="pdf">Upload a PDF file up to 5mb.</Label>
                </div>
            </TabsContent>
            <TabsContent value="URL"> <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="url">URL</Label>
                <Input type="url" id="url" placeholder="genai.kecyi.com/blog/life-insurance" />
            </div>
                <Label htmlFor="url">Upload a webpage as knowledge content.</Label>
            </TabsContent>
        </Tabs>
    </div>



}

export function AddContentDialog() {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [selectedFile, setSelectedFile] = React.useState<File | undefined>(undefined)
    const [selectedTab, setSelectedTab] = React.useState<'PDF' | 'URL'>('PDF')
    const [url, setURL] = React.useState<string>('')
    const [loading, setLoading] = React.useState(false)
    const { auth } = useAuthContext()

    const handleURLSubmit = (url: string) => {
        if (url.length === 0) {
            toast.error("Please enter a URL")
            return
        }
        // validate url input is a legitimate url
        const urlRegex = new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)
        if (!urlRegex.test(url)) {
            toast.error("Please enter a valid URL")
            return
        }
    }

    const handlePDFSubmit = async (selectedFile: File | undefined) => {
        if (auth.currentUser === null) {
            toast.error('Please sign in to upload content')
            return
        }
        if (!selectedFile) {
            toast.error("Please select a file")
            return
        }
        try {
            setLoading(true)
            // convert file to blob
            const {
                objectFullPath,
                objectURL } = await uploadPDFObject({
                    selectedFile,
                    uid: auth.currentUser.uid
                })

            if (objectFullPath === undefined || objectURL === undefined) {
                toast.error('Error uploading pdf')
                setLoading(false)
                return
            }
            console.log('objectFullPath', objectFullPath)
            await loadPDFAction({
                objectFullPath,
                objectURL,
                uid: auth.currentUser.uid,

            })
            // upload the file

            setLoading(false)

        } catch (err) {
            setLoading(false)
            console.error('Error loading pdf', err)
            toast.error('Something went wrong. Please try again later')
        }
    }

    const onSubmit = React.useCallback(() => {
        console.log('submitting')
        if (selectedTab === 'PDF') {
            handlePDFSubmit(selectedFile)
        } else {
            handleURLSubmit(url)
        }

    },
        [selectedFile, selectedTab, url,])


    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">Add Content</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Content</DialogTitle>
                        <DialogDescription>
                            Upload content to knowledge hub.<br /> This content will be available to the customer service support AI agent immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <AddContentMainBody
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        url={url}
                        setURL={setURL}
                    />
                    <DialogFooter className="w-full">
                        <div className="w-full flex flex-col  gap-2">
                            <Button
                                type="button"
                                disabled={loading}
                                onClick={onSubmit}
                                className='w-full'>Submit</Button>
                            <DialogClose asChild >
                                <Button className='w-full' variant={'outline'}>Close</Button>
                            </DialogClose>
                        </div>
                    </DialogFooter>
                </DialogContent>

            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline">Add Content</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Add Content</DrawerTitle>
                    <DrawerDescription>
                        Upload content to knowledge hub.<br /> This content will be available to the customer service support AI agent immediately.
                    </DrawerDescription>
                </DrawerHeader>
                <AddContentMainBody
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    url={url}
                    setURL={setURL}

                    className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

