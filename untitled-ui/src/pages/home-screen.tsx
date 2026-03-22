import { HeaderLayout } from "@/layouts/header-layout";
import { StravaActivitiesSection } from "@/components/marketing/strava-activities-section";

export const HomeScreen = () => {
    return (
        <HeaderLayout>
            <div className="mx-auto flex w-full flex-col items-center gap-6 px-4 lg:w-1/2">
                <StravaActivitiesSection />
            </div>
        </HeaderLayout>
    );
};
