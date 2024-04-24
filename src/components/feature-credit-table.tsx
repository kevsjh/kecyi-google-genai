import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { GenerateCollectionEnum, UserPlanEnum } from "@/constant/enum"
import { capitalizeFirstLetter, cn } from "@/lib/utils"



const featureCreditList = [
    {
        title: GenerateCollectionEnum.ROOMSTYLE,
        plan: UserPlanEnum.FREE,
        credit: 1,
    },
    {
        title: GenerateCollectionEnum.VIRTUALSTAGE,
        plan: UserPlanEnum.FREE,
        credit: 1,
    },
    {
        title: GenerateCollectionEnum.CHANGEFURNITURE,
        plan: UserPlanEnum.FREE,
        credit: 1,
    },
    {
        title: GenerateCollectionEnum.SEARCHFURNITURE,
        plan: UserPlanEnum.FREE,
        credit: 1,
    },
    {
        title: GenerateCollectionEnum.SKETCHRENDER,
        plan: UserPlanEnum.HOMEOWNER,
        credit: 2,
    },
    {
        title: GenerateCollectionEnum.THREEDRENDER,
        plan: UserPlanEnum.HOMEOWNER,
        credit: 2,
    },
    {
        title: GenerateCollectionEnum.UPSCALE,
        plan: UserPlanEnum.PROFESSIONAL,
        credit: 2,
    },
    {
        title: GenerateCollectionEnum.REMOVEBACKGROUND,
        plan: UserPlanEnum.PROFESSIONAL,
        credit: 3,
    },
    {
        title: GenerateCollectionEnum.TYPEREPLACE,
        plan: UserPlanEnum.PROFESSIONAL,
        credit: 5,
    },
    {
        title: GenerateCollectionEnum.GENERATIVEFILL,
        plan: UserPlanEnum.PROFESSIONAL,
        credit: 5,
    },
    {
        title: GenerateCollectionEnum.VIDEO,
        plan: UserPlanEnum.PROFESSIONAL,
        credit: 50,
    },
    {
        title: GenerateCollectionEnum.ADVANCEGENERATION_TEXT,
        plan: UserPlanEnum.PROFESSIONAL,
        credit: 5,
    },
    {
        title: GenerateCollectionEnum.ADVANCEGENERATION_IMAGE,
        plan: UserPlanEnum.PROFESSIONAL,
        credit: 1,
    }
]



export default function FeatureCreditTable({ className }: { className?: string }) {



    return <div className="w-full flex flex-col gap-6">

        <div className="grid grid-cols-2 gap-12">
            <div className="bg-indigo-purple rounded-2xl p-4">
                <p className="font-medium text-lg">How does credit works</p>
                <p className="text-sm">We leverage on different custom AI model for each different design feature.
                    Each design feature requires the correct subscription plan and a certain amount of credit to generate the design.

                    <br />The credit required for each design feature is mentioned in the table below.
                    We only charge credit if the design is generated successfully.

                    <br /> <br /> Pricing is subject to change as we iterate, add new features, and improve the existing ones.
                </p>

            </div>


            <div className="bg-secondary rounded-2xl p-4">
                <p className="font-medium text-lg">Ran out of credits?</p>
                <p className="text-sm">Each plan comes with a certain amount of credits that automatically renew every month.
                    <br />If you run out of credits, you can purchase more credits any time from your profile page.
                    <br /> <br />This purchased credits does not expire and can be used anytime if you run out of your monthly credits.
                </p>

            </div>

        </div>


        <div className={cn("p-2 bg-custom rounded-md", className)}>
            <Table className="w-full text-xs sm:text-sm ">

                <TableHeader>
                    <TableRow>
                        <TableHead>Design Feature</TableHead>
                        {/* <TableHead>Description</TableHead> */}
                        <TableHead>Plan</TableHead>
                        <TableHead>Credit</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        featureCreditList.map((item, index) => {
                            return <TableRow key={index}>

                                <TableCell>{capitalizeFirstLetter(item.title?.replace(/-/g, " "))}
                                    {item.title === GenerateCollectionEnum.VIDEO && ' (Alpha Feature)'}

                                </TableCell>
                                <TableCell>{capitalizeFirstLetter(item.plan)}</TableCell>
                                <TableCell>{item.credit}</TableCell>

                            </TableRow>
                        })
                    }

                </TableBody>
            </Table>
        </div>

    </div>
}