import { Star } from "@phosphor-icons/react/dist/ssr"



const reviews = [
    {
        name: "Emily Fee",
        role: "Interior Designer",
        review: "This tool has been a game changer for me ... It has so many features carefully thought out to make my work easier and faster. I love it."
    },
    {
        name: "Thomas Silva",
        role: "Furniture Distributor",
        review: "Background removal and type to replace are my favorite. I can easily replace the background of an image and replace the text with my own."
    },
    {
        name: "Susie Nui",
        role: "Real Estate Agent",
        review: "Newroom.io has helped me create stunning images for my listings. I can now quickly fill an empty room with furniture and decor to give my clients a better idea of what the space could look like."
    }



]

export default function UserReviewShowcase({ className }: { className?: string }) {
    return <div className="w-full bg-custom rounded-3xl shadow-md py-12 px-6">
        <div className="flex justify-center">  <div className="bg-primary w-fit p-4 rounded-lg"><Star size={35} className="fill-white" /></div></div>
        <div className="text-center flex flex-col gap-2 py-4">
            <h2 className="text-4xl font-medium">What our <span className="italic">users</span> say </h2>
            <p className="text-primary">Discover the experiences that our users have been sharing</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {
                reviews.map((review, index) => {
                    return <div key={index} className="p-6 flex flex-col justify-between gap-2  bg-white text-primary rounded-3xl shadow-md">
                        <div className="flex items-center gap-2">
                            <Star size={20} weight="fill" className="fill-yellow-300" />
                            <Star size={20} weight="fill" className="fill-yellow-300" />
                            <Star size={20} weight="fill" className="fill-yellow-300" />
                            <Star size={20} weight="fill" className="fill-yellow-300" />
                            <Star size={20} weight="fill" className="fill-yellow-300" />
                        </div>
                        <p>{review.review}</p>
                        <div className="text-sm">
                            <p>{review.name}</p>
                            <p className="font-medium">{review.role}</p>
                        </div>
                    </div>

                })
            }


        </div>
    </div >
}