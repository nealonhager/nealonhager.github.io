import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, "../public/data/strava-activities.json");
const stravaTokenUrl = "https://www.strava.com/oauth/token";
const stravaActivitiesUrl = "https://www.strava.com/api/v3/athlete/activities";
const githubOutputPath = process.env.GITHUB_OUTPUT;

/**
 * @typedef {{
 *   id: number;
 *   name: string;
 *   sport_type: string;
 *   start_date: string;
 *   distance: number;
 *   moving_time: number;
 *   elapsed_time: number;
 *   total_elevation_gain: number;
 *   average_speed: number | null;
 *   private: boolean;
 *   timezone?: string;
 *   location_city?: string | null;
 *   location_state?: string | null;
 *   location_country?: string | null;
 * }} StravaActivityResponse
 */

/**
 * @typedef {{
 *   access_token: string;
 *   expires_at: number;
 *   expires_in: number;
 *   refresh_token: string;
 *   token_type: string;
 * }} StravaTokenResponse
 */

/**
 * @typedef {{
 *   clientId: string;
 *   clientSecret: string;
 *   refreshToken: string;
 * }} StravaConfig
 */

/**
 * @typedef {{
 *   id: number;
 *   name: string;
 *   sportType: string;
 *   startDate: string;
 *   distanceMeters: number;
 *   movingTimeSeconds: number;
 *   elapsedTimeSeconds: number;
 *   totalElevationGainMeters: number;
 *   averageSpeedMetersPerSecond: number | null;
 *   timezone: string | null;
 *   locationCity: string | null;
 *   locationState: string | null;
 *   locationCountry: string | null;
 *   externalUrl: string;
 * }} PublicStravaActivity
 */

/**
 * @typedef {{
 *   generatedAt: string;
 *   note: string;
 *   activities: PublicStravaActivity[];
 * }} StravaActivitiesPayload
 */

/**
 * Writes a GitHub Actions output when the script runs in CI.
 *
 * @param {string} name
 * @param {string} value
 * @returns {Promise<void>}
 */
async function setGithubOutput(name, value) {
    if (!githubOutputPath) {
        return;
    }

    await writeFile(githubOutputPath, `${name}=${value}\n`, { flag: "a" });
}

/**
 * Masks a value in GitHub Actions logs.
 *
 * @param {string} value
 * @returns {void}
 */
function maskGithubValue(value) {
    if (!value || !process.env.GITHUB_ACTIONS) {
        return;
    }

    console.log(`::add-mask::${value}`);
}

/**
 * Returns the Strava config when all required variables are present.
 *
 * @returns {StravaConfig | null}
 */
function readStravaConfig() {
    const clientId = process.env.STRAVA_CLIENT_ID?.trim() ?? "";
    const clientSecret = process.env.STRAVA_CLIENT_SECRET?.trim() ?? "";
    const refreshToken = process.env.STRAVA_REFRESH_TOKEN?.trim() ?? "";

    if (!clientId || !clientSecret || !refreshToken) {
        return null;
    }

    return { clientId, clientSecret, refreshToken };
}

/**
 * Builds the fallback payload used when Strava credentials are unavailable.
 *
 * @param {string} note
 * @returns {StravaActivitiesPayload}
 */
function createPayload(note) {
    return {
        generatedAt: new Date().toISOString(),
        note,
        activities: [],
    };
}

/**
 * Persists the generated Strava payload into the public data directory.
 *
 * @param {StravaActivitiesPayload} payload
 * @returns {Promise<void>}
 */
async function writePayload(payload) {
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

/**
 * Exchanges the long-lived refresh token for a short-lived access token.
 *
 * @param {StravaConfig} config
 * @returns {Promise<StravaTokenResponse>}
 */
async function refreshAccessToken(config) {
    const response = await fetch(stravaTokenUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            grant_type: "refresh_token",
            refresh_token: config.refreshToken,
        }),
    });

    if (!response.ok) {
        throw new Error(`Strava token refresh failed with status ${response.status}.`);
    }

    return /** @type {Promise<StravaTokenResponse>} */ (response.json());
}

/**
 * Fetches a page of recent athlete activities.
 *
 * @param {string} accessToken
 * @returns {Promise<StravaActivityResponse[]>}
 */
async function fetchRecentActivities(accessToken) {
    const url = new URL(stravaActivitiesUrl);
    url.searchParams.set("page", "1");
    url.searchParams.set("per_page", "30");

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Strava activities request failed with status ${response.status}.`);
    }

    return /** @type {Promise<StravaActivityResponse[]>} */ (response.json());
}

/**
 * Returns true when the activity is safe to publish from the API fields we get.
 *
 * The Strava API exposes a `private` flag but does not expose a stricter
 * distinction between followers-only and fully public activities here.
 *
 * @param {StravaActivityResponse} activity
 * @returns {boolean}
 */
function isPublishableActivity(activity) {
    return activity.private === false;
}

/**
 * Normalizes the Strava response to the narrow public payload used by the site.
 *
 * @param {StravaActivityResponse} activity
 * @returns {PublicStravaActivity}
 */
function toPublicActivity(activity) {
    return {
        id: activity.id,
        name: activity.name,
        sportType: activity.sport_type,
        startDate: activity.start_date,
        distanceMeters: activity.distance,
        movingTimeSeconds: activity.moving_time,
        elapsedTimeSeconds: activity.elapsed_time,
        totalElevationGainMeters: activity.total_elevation_gain,
        averageSpeedMetersPerSecond: activity.average_speed,
        timezone: activity.timezone ?? null,
        locationCity: activity.location_city ?? null,
        locationState: activity.location_state ?? null,
        locationCountry: activity.location_country ?? null,
        externalUrl: `https://www.strava.com/activities/${activity.id}`,
    };
}

/**
 * Generates the public site payload from the latest Strava activities.
 *
 * @param {StravaConfig} config
 * @returns {Promise<{ payload: StravaActivitiesPayload; refreshToken: string; refreshTokenChanged: boolean }>}
 */
async function buildPayload(config) {
    const token = await refreshAccessToken(config);
    maskGithubValue(token.refresh_token);

    const activities = await fetchRecentActivities(token.access_token);
    const publicActivities = activities.filter(isPublishableActivity).slice(0, 5).map(toPublicActivity);

    return {
        payload: {
            generatedAt: new Date().toISOString(),
            note: "This feed excludes activities marked private.",
            activities: publicActivities,
        },
        refreshToken: token.refresh_token,
        refreshTokenChanged: token.refresh_token !== config.refreshToken,
    };
}

/**
 * Runs the sync and writes outputs for the workflow.
 *
 * @returns {Promise<void>}
 */
async function main() {
    const config = readStravaConfig();

    if (!config) {
        console.warn("Strava secrets are not configured. Writing an empty activities payload.");
        await writePayload(createPayload("Set the Strava GitHub secrets to publish your latest activities."));
        await setGithubOutput("refresh-token-changed", "false");
        await setGithubOutput("activities-count", "0");
        return;
    }

    const result = await buildPayload(config);

    await writePayload(result.payload);
    await setGithubOutput("refresh-token-changed", result.refreshTokenChanged ? "true" : "false");
    await setGithubOutput("activities-count", String(result.payload.activities.length));

    if (result.refreshTokenChanged) {
        await setGithubOutput("refresh-token", result.refreshToken);
    }

    console.log(`Wrote ${result.payload.activities.length} Strava activities to ${outputPath}.`);
}

main().catch(async (error) => {
    const message = error instanceof Error ? error.message : "Unknown Strava sync error.";

    console.error(message);
    await setGithubOutput("refresh-token-changed", "false");
    process.exitCode = 1;
});
