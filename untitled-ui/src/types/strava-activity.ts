/**
 * The public subset of a Strava activity that is safe to ship to the browser.
 */
export interface StravaActivity {
    id: number;
    name: string;
    sportType: string;
    startDate: string;
    distanceMeters: number;
    movingTimeSeconds: number;
    elapsedTimeSeconds: number;
    totalElevationGainMeters: number;
    averageSpeedMetersPerSecond: number | null;
    kudosCount: number;
    commentCount: number;
    achievementCount: number;
    timezone: string | null;
    locationCity: string | null;
    locationState: string | null;
    locationCountry: string | null;
    externalUrl: string;
}

/**
 * The generated payload published by the Strava sync workflow.
 */
export interface StravaActivitiesPayload {
    generatedAt: string;
    note: string;
    activities: StravaActivity[];
}
