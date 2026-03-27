import { ArrowRight, Share04 } from "@untitledui/icons";
import { useEffect, useState } from "react";
import { Button } from "@/components/base/buttons/button";
import type { StravaActivitiesPayload, StravaActivity } from "@/types/strava-activity";
import { Badge } from "../base/badges/badges";

const stravaDataPath = `${import.meta.env.BASE_URL}data/strava-activities.json`;

type StravaActivitiesState =
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "ready"; payload: StravaActivitiesPayload };

/**
 * Loads and renders the generated Strava activity feed for the home page.
 */
export function StravaActivitiesSection() {
    const [state, setState] = useState<StravaActivitiesState>({ status: "loading" });

    useEffect(() => {
        let isCancelled = false;

        async function loadActivities() {
            try {
                const response = await fetch(stravaDataPath, { cache: "no-store" });

                if (!response.ok) {
                    throw new Error("Unable to load the latest Strava activities.");
                }

                const payload = (await response.json()) as StravaActivitiesPayload;

                if (!isCancelled) {
                    setState({ status: "ready", payload });
                }
            } catch {
                if (!isCancelled) {
                    setState({
                        status: "error",
                        message: "The latest Strava snapshot is unavailable right now.",
                    });
                }
            }
        }

        void loadActivities();

        return () => {
            isCancelled = true;
        };
    }, []);

    return (
        <div>
            <h1 className="pt-16 text-center text-display-lg font-semibold text-primary">Training log</h1>
            <StravaActivitiesContent state={state} />
        </div>
    );
}

/**
 * Selects the right UI state for the generated Strava payload.
 */
function StravaActivitiesContent({ state }: { state: StravaActivitiesState }) {
    if (state.status === "loading") {
        return <StatusCard message="Loading the latest Strava activities..." />;
    }

    if (state.status === "error") {
        return <StatusCard message={state.message} />;
    }

    if (state.payload.activities.length === 0) {
        return (
            <div className="flex flex-col gap-3 rounded-2xl border border-secondary bg-secondary px-5 py-4">
                <p className="text-md font-medium text-primary">No Strava activities are published yet.</p>
                <p className="text-sm text-tertiary">{state.payload.note}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <span className="text-center text-sm text-secondary pb-16">Updated {formatGeneratedAt(state.payload.generatedAt)}</span>
            <ul className="flex flex-col gap-8">
                {state.payload.activities.map((activity) => (
                    <li key={activity.id}>
                        <StravaActivityCard activity={activity} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

/**
 * Renders a single Strava activity card.
 */
function StravaActivityCard({ activity }: { activity: StravaActivity }) {
    const location = formatLocation(activity);

    return (
        <article className="flex flex-col gap-4 rounded-2xl border border-secondary px-5 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-row gap-2 justify-between w-full">
                <div className="flex flex-col">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-semibold text-primary">{activity.name}</h2>
                        {location && <p className="text-sm text-tertiary">{location}</p>}
                    </div>
                    <div className="flex flex-row gap-4">
                        <span className="text-sm text-secondary">{activity.sportType}</span>
                        <span className="text-sm text-tertiary">{formatActivityDate(activity.startDate)}</span>
                    </div>
                </div>
                <Button href={activity.externalUrl} color="link-gray" iconTrailing={Share04} target="_blank" rel="noreferrer" size="sm">
                    View on Strava
                </Button>
                </div>
            </div>
            <dl className="flex flex-row text-sm justify-between">
                <ActivityMetric label="Distance" value={formatDistance(activity.distanceMeters)} />
                <ActivityMetric label="Moving time" value={formatDuration(activity.movingTimeSeconds)} />
                <ActivityMetric label="Elevation gain" value={formatElevation(activity.totalElevationGainMeters)} />
            </dl>
        </article>
    );
}

/**
 * Displays one activity metric in a compact, readable layout.
 */
function ActivityMetric({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <dt className="text-xs font-medium tracking-wide text-secondary">{label}</dt>
            <dd className="text-md font-semibold text-primary">{value}</dd>
        </div>
    );
}

/**
 * Renders a simple state card for loading and error states.
 */
function StatusCard({ message }: { message: string }) {
    return (
        <div className="rounded-2xl border border-secondary bg-secondary px-5 py-4">
            <p className="text-md font-medium text-primary">{message}</p>
        </div>
    );
}

/**
 * Formats the generated timestamp in a compact local format.
 */
function formatGeneratedAt(value: string) {
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

/**
 * Formats a Strava activity start date for display.
 */
function formatActivityDate(value: string) {
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
    }).format(new Date(value));
}

/**
 * Formats meters as miles for a compact card summary.
 */
function formatDistance(distanceMeters: number) {
    const miles = distanceMeters / 1609.344;

    return `${miles.toFixed(1)} mi`;
}

/**
 * Formats seconds as a human-readable duration.
 */
function formatDuration(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours === 0) {
        return `${minutes} min`;
    }

    return `${hours} hr ${minutes} min`;
}

/**
 * Formats meters of climbing using the metric value from Strava.
 */
function formatElevation(totalElevationGainMeters: number) {
    return `${Math.round(totalElevationGainMeters)} m`;
}

/**
 * Builds a compact location label from the available activity metadata.
 */
function formatLocation(activity: StravaActivity) {
    const parts = [activity.locationCity, activity.locationState, activity.locationCountry].filter(Boolean);

    return parts.join(", ");
}
