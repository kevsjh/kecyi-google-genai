import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"


export default function FAQ() {

    return <Accordion type="multiple" className="bg-white p-6 rounded-2xl">
        <AccordionItem value="item-1">
            <AccordionTrigger>Do you have an affiliate program?</AccordionTrigger>
            <AccordionContent>
                Yes, we do. When you join <Link className="font-medium underline" href={'https://newroom.promotekit.com'}
                    target="_blank"> newroom.io affiliate program
                </Link>, you receive a 20% commission on payments for all customers you refer!
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
            <AccordionTrigger>How does newroom.io works</AccordionTrigger>
            <AccordionContent>
                Newroom.io let's you upload photos of your interior design, select style and redesign it.
                Beyond that, we also offer a whole suite of tools to help you with your interior design projects.
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
            <AccordionTrigger>How long will it take to generate my AI photo</AccordionTrigger>
            <AccordionContent>
                In general, most of the design features takes about 20-50 seconds to generate the AI photo.
                This is quicker than most of the other AI design tools in the market. Video generation usually takes around 1-2 minutes.
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
            <AccordionTrigger>Will I be charged for failed design request</AccordionTrigger>
            <AccordionContent>
                In the event the design request fails and the photo is not generated, you will not be charged any credit.
                We only charge credit if the design is generated successfully.
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
            <AccordionTrigger>Who can use newroom.io</AccordionTrigger>
            <AccordionContent>
                Everyone! Whether you are a professional or a homeowner, you can use newroom.io to
                generate images and videos for your projects. We have designers, real estate agents, and more using our platform.
                We are open to feedback and ideas to solve your pain points.
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
            <AccordionTrigger>What is Interior Design Video</AccordionTrigger>
            <AccordionContent>
                Interior Design Video is an alpha feature where you can generate a video from your photo.
                However, the generated video is not perfect and may have some issues.
                We have expose some advance control for you on the video generation page to adjust the video generation but this is still in alpha stage.
                We will share more information on this feature soon.
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
            <AccordionTrigger>Is the payment service secure</AccordionTrigger>
            <AccordionContent>
                Yes, our financial payment is secure. We uses Stripe for financial processing, and we do not store any credit card information.
                Stripe ensures bank-level security standards and is used by the largest companies in the world.
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-8">
            <AccordionTrigger>Can I get a refund</AccordionTrigger>
            <AccordionContent>
                Unfortunately, we are not able to offer refunds as the cost for AI image generation are extremly high.
                However, you can cancel your subscription at any time, and you will not be charged again.
                Your subscription will remain active until the end of the billing cycle.
                If there's anything we can do to help, please let us know.
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-9">
            <AccordionTrigger>How do I cancel my subscription</AccordionTrigger>
            <AccordionContent>
                You may cancel your subscription anytime from your profile page.
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-10">
            <AccordionTrigger>How do I contact the team</AccordionTrigger>
            <AccordionContent>
                You may <a className="font-medium " href="#tally-open=wkyrMr&tally-emoji-text=👋&tally-emoji-animation=wave">contact us</a> here
            </AccordionContent>
        </AccordionItem>
    </Accordion>

}