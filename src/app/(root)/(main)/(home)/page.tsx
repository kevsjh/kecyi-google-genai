

import StartDesignSection from "../_components/start-design-section";
import CollectionShowcase from "../_components/collection-showcase";
import UserReviewShowcase from "@/components/user-review-showcase";
import { Badge } from "@/components/ui/badge";
import { Star } from "@phosphor-icons/react/dist/ssr";

import FeatureSection from "../_components/feature-section";
import AccessPortalButton from "../_components/access-portal";


export default function Home() {
  return (
    <main className=" flex w-full  h-full gap-4 flex-col items-center justify-between py-6">

      <div className=" min-h-screen pt-8 lg:pt-4 flex w-full h-full  flex-col gap-8 items-center">
        <Badge className="border border-secondary font-medium text-sm flex gap-1 items-center">

          Google Cloud GenAI APAC 2024

        </Badge>
        <div className="flex flex-col gap-4 pt-4 items-center">
          <h1 className="tracking-wide leading-snug text-primary text-center text-4xl sm:text-5xl md:text-6xl font-medium">
            Submission by <br /> <strong>KECYI</strong>
            <br /> Google Cloud
            <br />
            GenAI APAC 2024
          </h1>
        </div>
        <AccessPortalButton />

      </div>

    </main>
  );
}
