import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



export default function FeatureSection() {
    return <div className="w-full   rounded-3xl shadow-md ">
        <div className="flex text-secondary flex-col gap-4  py-3 items-center">
            <Badge className="w-fit border-secondary py-2 font-normal rounded-lg">Use Case</Badge>
            <p className="text-center text-5xl  font-medium italic">Benefits</p>
            {/* <p className="text-lg text-center font-light">Get inspired! <br />See how others elevate designs with NewRoom</p> */}

        </div>


        <Tabs defaultValue="home" className="w-full flex flex-col gap-6">
            <div className="flex w-full  justify-center">
                <TabsList className="bg-transparent border border-muted text-white   w-fit h-full  flex flex-wrap">
                    <TabsTrigger className="" value="home">Home Owner</TabsTrigger>
                    <TabsTrigger value="interior">Interior Designer</TabsTrigger>
                    <TabsTrigger value="real-estate">Real Estate</TabsTrigger>
                    <TabsTrigger value="property">Property Developer</TabsTrigger>
                    <TabsTrigger value="business">Business Owner</TabsTrigger>
                    <TabsTrigger value="furniture">Furniture Sellers</TabsTrigger>
                    <TabsTrigger value="architect">Architect</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="home" className="rounded-2xl overflow-clip bg-muted">
                <div className=" grid  gap-3 md:gap-6 justify-between grid-cols-1 sm:grid-cols-2">
                    <div className="p-6 items-start text-start   flex flex-col gap-4">
                        <p className="text-2xl md:text-5xl italic text-primary font-semibold">
                            Visualize and Actionable
                        </p>
                        <p className="text-base md:text-lg">
                            See your dream room come to life in seconds with our AI.
                            <br />
                            Plan your renovation seamlessly - visualize & find the perfect furniture.
                            <br /><br />
                            Start planning your dream renovation today!
                        </p>
                    </div>
                    <div className="">
                        <img
                            className="h-full w-full aspect-[4/3] object-cover  shadow-md"
                            src="/assets/feature/home.png"
                        />

                    </div>
                </div>

            </TabsContent>
            <TabsContent value="interior" className="rounded-2xl  overflow-clip bg-muted">
                <div className=" grid  gap-3 md:gap-6 justify-between grid-cols-1 sm:grid-cols-2">
                    <div className="p-6 items-start text-start   flex flex-col gap-4">
                        <p className="text-2xl md:text-5xl italic text-primary font-semibold">
                            Elevate Design
                        </p>
                        <p className="text-base md:text-lg">

                            Generate Stunning & Unique Design Ideas: In seconds, newroom.io creates multiple,
                            inspiring design concepts tailored to your client&apos;s preferences and style.
                            <br /><br />Go beyond generic options and impress them with fresh possibilities.
                            <br /> <br />Save Valuable Time & Focus on What Matters: Free yourself from tedious initial design phases.
                            newroom.io jumpstarts your workflow, allowing you to dedicate more time to refining details and building strong client relationships.
                        </p>
                    </div>
                    <div className="">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            className="h-full w-full aspect-[4/3] object-cover  shadow-md"
                            src="/assets/feature/interior.png"
                        />

                    </div>
                </div>

            </TabsContent>
            <TabsContent value="real-estate" className="rounded-2xl overflow-clip bg-muted">
                <div className=" grid  gap-3 md:gap-6 justify-between grid-cols-1 sm:grid-cols-2">
                    <div className="p-6 items-start text-start   flex flex-col gap-4">
                        <p className="text-2xl  md:text-5xl italic text-primary font-semibold">
                            Attract Qualified Leads
                        </p>
                        <p className="text-base md:text-lg">
                            Turn empty spaces into buyer magnets: Showcase the full potential of your listings with virtual staging.
                            <br />     <br />
                            Fill vacant rooms with stylish furniture and decor,
                            allowing buyers to envision themselves living there.
                            <br />
                            Let us virtually stage your listings and watch them sell faster and for more.
                        </p>
                    </div>
                    <div className="">
                        <img
                            className="h-full w-full aspect-[4/3] object-cover  shadow-md"
                            src="/assets/feature/estate.png"
                        />

                    </div>
                </div>

            </TabsContent>

            <TabsContent value="property" className="rounded-2xl overflow-clip bg-muted">
                <div className=" grid  gap-3 md:gap-6 justify-between grid-cols-1 sm:grid-cols-2">
                    <div className="p-6 items-start text-start   flex flex-col gap-4">
                        <p className="text-2xl md:text-5xl italic text-primary font-semibold">
                            Market Your Property Faster
                        </p>
                        <p className="text-base md:text-lg">
                            Increase lease interest: High-quality photos featuring virtual furniture and decor grab attention and help renters envision themselves living in your units.

                            <br /><br />
                            Showcase diverse layouts: Appeal to a wider range of renters by virtually staging different unit layouts with various furniture arrangements.

                        </p>
                    </div>
                    <div className="">
                        <img
                            className="h-full w-full aspect-[4/3] object-cover  shadow-md"
                            src="/assets/feature/property.png"
                        />

                    </div>
                </div>

            </TabsContent>

            <TabsContent value="business" className="rounded-2xl overflow-clip bg-muted">
                <div className=" grid  gap-3 md:gap-6 justify-between grid-cols-1 sm:grid-cols-2">
                    <div className="p-6 items-start text-start   flex flex-col gap-4">
                        <p className="text-2xl   md:text-5xl italic text-primary font-semibold">
                            Unlock Business Potential
                        </p>
                        <p className="text-base md:text-lg">
                            Move beyond the ordinary: Ditch generic layouts and create a space that&apos;s as unique as your brand.
                            <br />
                            <br />
                            Leverage our AI tools to help you design an experience that resonate with your customers, leaving a lasting impression.

                        </p>
                    </div>
                    <div className="">
                        <img
                            className="h-full w-full aspect-[4/3] object-cover  shadow-md"
                            src="/assets/feature/business.png"
                        />
                    </div>
                </div>

            </TabsContent>

            <TabsContent value="furniture" className="rounded-2xl overflow-clip bg-muted">
                <div className=" grid  gap-3 md:gap-6 justify-between grid-cols-1 sm:grid-cols-2">
                    <div className="p-6 items-start text-start   flex flex-col gap-4">
                        <p className="text-2xl  md:text-5xl italic text-primary font-semibold">
                            Elevate and Stage
                        </p>
                        <p className="text-base md:text-lg">
                            Focus on what matters most: No more spending hours editing photos! Our tool lets you focus on creating compelling product descriptions and marketing strategies while it takes care of the visuals.
                            <br /><br />
                            Create a consistent, high-quality brand image: Our tool ensures your product photos have a clean, professional look, regardless of the original background.
                        </p>
                    </div>
                    <div className="">
                        <img
                            className="h-full w-full aspect-[4/3] object-cover  shadow-md"
                            src="/assets/feature/furniture.png"
                        />
                    </div>
                </div>

            </TabsContent>
            <TabsContent value="architect" className="rounded-2xl overflow-clip bg-muted">
                <div className=" grid gap-3 md:gap-6 justify-between  grid-cols-1 sm:grid-cols-2">
                    <div className="p-6 items-start text-start   flex flex-col gap-4">
                        <p className="text-2xl  md:text-5xl italic text-primary font-semibold">
                            Creativity on Steroids
                        </p>
                        <p className="text-base md:text-lg">
                            Focus on creativity, not technical limitations.
                            <br />     <br />
                            Our user-friendly interface empowers you to focus on what matters most - your design genius.
                            <br />
                            <br />
                            Let our technology handle the rendering, freeing your time to explore innovative ideas.
                        </p>
                    </div>
                    <div className="">
                        <img
                            className="h-full w-full aspect-[4/3] object-cover  shadow-md"
                            src="/assets/feature/architect.png"
                        />
                    </div>
                </div>

            </TabsContent>
        </Tabs>




    </div>
}