
import { Badge } from "@/components/ui/badge";


import { CirclesThree } from "@phosphor-icons/react/dist/ssr";

import Link from "next/link";
import { ImgComparisonSlider } from "@/components/img-comparison-slider";
import { ImgHoverComparison } from "@/components/img-hover-comparison";


const designActionItems = [
    {
        title: "Room Styling",
        description: "Explore 20+ curated room styles and blend their elements into your own space.  Mix and match to create a look that's truly you.",

        image: (

            <ImgComparisonSlider
                className="max-w-full rounded-2xl shadow-md aspect-[4/3]"
                imageClassname="max-w-full object-cover"
                firstImageSrc={"/assets/hero-images/room-style-before.jpg"}
                secondImageSrc={"/assets/hero-images/room-style-after.jpg"}
            />

        ),

        link: "/generate/room-style",
        professional: false,
        badge: (
            <Badge className="bg-slate-200 rounded-lg font-normal px-1 py-1 h-6 text-black hover:bg-slate-200/80">
                Popular 🔥
            </Badge>
        ),
        singleImage: false,
        comingSoon: false,
    },
    {
        title: "Virtual Staging",
        description:
            "Instantly furnish your empty space with furnitures! Upload a photo and instantly explore styles & layouts in seconds",
        image: (
            <ImgComparisonSlider
                className="max-w-full rounded-2xl shadow-md aspect-[4/3]"
                imageClassname="max-w-full object-cover"
                firstImageSrc={"/assets/hero-images/virtual-stage-before.jpg"}
                secondImageSrc={"/assets/hero-images/virtual-stage-after.jpg"}
            />
        ),
        link: "/generate/virtual-stage",
        professional: false,
        badge: <></>,
        comingSoon: false,
        singleImage: false,
    },

    {
        title: "Change/Remove Furniture",
        description:
            "Virtually paint your furniture! Easily edit or remove furniture in seconds. It's like Photoshop for your home.",

        image: (

            <ImgComparisonSlider
                className="max-w-full rounded-2xl shadow-md aspect-[4/3]"
                imageClassname="max-w-full object-cover"
                firstImageSrc={"/assets/hero-images/change-furniture-before.jpg"}
                secondImageSrc={"/assets/hero-images/change-furniture-after.jpg"}
            />

        ),

        link: "/generate/change-furniture",
        professional: false,
        badge: <></>,
        comingSoon: false,
        singleImage: false,
    },

    {
        title: "Search Furniture Products",
        description:
            "Find furniture for your space instantly! Upload a photo and let our AI suggest pieces from top retailers.",

        image: (
            <div className="h-full w-full  relative aspect-[4/3]">
                {" "}
                <img
                    className="h-full object-cover rounded-2xl  w-full"

                    alt="furniture-thumbnail"
                    src="/assets/hero-images/furniture-thumbnail.png"
                />
            </div>
        ),

        link: "/generate/search-furniture",
        professional: false,
        badge: <></>,
        comingSoon: false,
        singleImage: true,
    },
    {
        title: "Sketch Rendering",
        description:
            "Just finish your sketch? Use this to visualise your sketch drawing into rendered room photos quick.",

        image: (

            <ImgComparisonSlider
                className="max-w-full rounded-2xl shadow-md aspect-[4/3]"
                imageClassname="max-w-full object-cover"
                firstImageSrc={"/assets/hero-images/sketch-render-before.jpg"}
                secondImageSrc={"/assets/hero-images/sketch-render-after.jpg"}
            />

        ),

        link: "/generate/sketch-render",
        professional: true,
        badge: (
            <Badge className="bg-slate-200 w-fit rounded-lg font-normal px-1 py-1  h-6 text-black hover:bg-slate-200/80">
                Pro Plan 😎
            </Badge>
        ),
        comingSoon: true,
        singleImage: false,
    },

    {
        title: "3D Model Rendering",
        description:
            "Effortlessly transform 3d renders! Get high-quality room design from your 3d renders - fast!",

        image: (
            <ImgComparisonSlider
                className="max-w-full rounded-2xl shadow-md aspect-[4/3]"
                imageClassname="max-w-full object-cover"
                firstImageSrc={"/assets/hero-images/3d-before.jpg"}
                secondImageSrc={"/assets/hero-images/3d-after.jpg"}
            />


        ),

        link: "/generate/3d-render",
        professional: true,
        badge: (
            <Badge className="bg-slate-200 w-fit rounded-lg font-normal px-1 py-1 h-6 text-black hover:bg-slate-200/80">
                Pro Plan 😎
            </Badge>
        ),
        comingSoon: true,
        singleImage: false,
    },

    {
        title: "Upscale Image",
        description:
            "Sharpen your designs! Instantly boost resolution for a more professional impact. Make a great first impression - try it now!",
        image: (

            <ImgComparisonSlider
                className="max-w-full rounded-2xl shadow-md aspect-[4/3]"
                imageClassname="max-w-full object-cover"
                firstImageSrc={"/assets/hero-images/upscale-before.png"}
                secondImageSrc={"/assets/hero-images/upscale-after.png"}
            />

        ),

        link: "/generate/upscale",
        professional: false,
        badge: <></>,
        comingSoon: true,
        singleImage: false,
    },
    {
        title: "Interior Video Showcase",
        description:
            "Walkthroughs and flythroughs made easy! Upload your room photo and get a quick interior video.",
        image: (
            <ImgComparisonSlider
                className="max-w-full rounded-2xl shadow-md aspect-[4/3]"
                imageClassname="max-w-full object-cover aspect-[4/3]"
                firstImageSrc={"/assets/hero-images/video-before.png"}
                secondImageSrc={"/assets/hero-images/video-after.mp4"}
                showVideo={true}

            />

        ),
        link: "/generate/video",
        professional: false,
        badge: (
            <Badge className="bg-slate-200 w-fit rounded-lg font-normal px-1 py-1 h-6 text-black hover:bg-slate-200/80">
                Pro Plan 😎
            </Badge>
        ),
        comingSoon: true,
        singleImage: false,
    },
    {
        title: "Remove Background",
        description:
            "Showcase furniture in any space! Effortlessly remove backgrounds from furniture photos to create stunning mockups and presentations",
        image: (

            <ImgHoverComparison
                className="max-w-full rounded-2xl  aspect-[4/3]"
                imageClassname="max-w-full object-cover aspect-[4/3]"
                firstImageSrc={"/assets/hero-images/remove-bg-before.png"}
                secondImageSrc={"/assets/hero-images/remove-bg-after.png"}
            />

        ),

        link: "/generate/remove-background",
        professional: false,
        badge: <></>,
        comingSoon: true,
        singleImage: false,
    },
    {
        title: "Type and Replace",
        description:
            "Instantly replace furniture or backgrounds in your room. Type it, swap it, love it!  It's like Photoshop for everyone. ",
        image: (

            <div className="h-full w-full  relative ">

                <img
                    className="h-full  object-cover rounded-2xl aspect-[4/3] w-full"

                    alt="furniture-thumbnail"
                    src="/assets/hero-images/type-replace.gif"
                />
            </div>


        ),

        link: "/generate/type-replace",
        professional: false,
        badge: <></>,
        comingSoon: true,
        singleImage: false,
    },

    {
        title: "Generative Fill",
        description:
            "Extend your designs beyond the borders, add more details or create panoramic view of your design easily in seconds.",
        image: (

            <div className="h-full w-full  relative ">

                <img
                    className="h-full  object-cover rounded-2xl aspect-[4/3] w-full"

                    alt="furniture-thumbnail"
                    src="/assets/hero-images/generative-fill.gif"
                />
            </div>

        ),

        link: "/generate/generative-fill",
        professional: false,
        badge: <></>,
        comingSoon: true,
        singleImage: false,
    },

    {
        title: "Advance Generation",
        description:
            "Feeling limited by pre-made designs? Unleash your creativity and craft custom interior designs with your own creativity and prompts.",
        image: (

            <div className="h-full w-full  relative ">

                <img
                    className="h-full  object-cover rounded-2xl aspect-[4/3] w-full"

                    alt="furniture-thumbnail"
                    src="/assets/hero-images/advance-generation.gif"
                />
            </div>
        ),

        link: "/generate/advance-generation",
        professional: false,
        badge: <></>,
        comingSoon: true,
        singleImage: false,
    },
];




export default function StartDesignSection() {
    return <section>
        <div className="bg-secondary rounded-3xl flex flex-col gap-4  text-primary w-full p-6">

            <div className="pt-10 pb-6 flex flex-col gap-4 items-center justify-center">
                <div className="rounded-lg p-4 bg-primary w-fit h-fit">
                    <CirclesThree size={36} className="fill-white" />
                </div>
                <p className="text-center text-5xl text-primary font-medium">Start Designing Now</p>
                <p className="text-primary text-lg text-center ">Discover what
                    {' '} <strong>NewRoom</strong> <br />Interior Design Asssistant can help you with</p>
            </div>


            <div className="grid  grid-cols-1 md:grid-cols-2  2xl:grid-cols-3 gap-8" >
                {
                    designActionItems.map((item, index) => {
                        return <div key={index} className="
                            flex bg-background border rounded-3xl 
                            flex-col text-primary gap-4  p-4 lg:p-4">
                            <div className="w-full  h-full  overflow-clip  relative ">
                                {item.image}
                            </div>
                            <div className="w-full  ">
                                <div className="flex flex-col  justify-between gap-2">
                                    <div >
                                        <h2 className=" text-xl lg:text-2xl  font-semibold">{item.title}</h2>
                                        <p className="md:text-sm  lg:text-base">{item.description}</p></div>
                                    <Link
                                        href={item.link}
                                        className="text-center hover:bg-primary/90 px-14 py-4 bg-primary  text-white rounded-lg font-medium text-lg transform transition duration-200 
                                        sm:hover:scale-110"
                                    >
                                        Design Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    </section >
}