import "dotenv/config";
import process from "node:process";

const stravaTokenUrl = "https://www.strava.com/oauth/token";

/**
 * Reads a required environment variable and throws when missing.
 *
 * @param {string} name
 * @returns {string}
 */
function readRequiredEnv(name) {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

/**
 * Exchanges a one-time Strava auth code for the initial tokens.
 *
 * @returns {Promise<void>}
 */
async function main() {
    const clientId = readRequiredEnv("STRAVA_CLIENT_ID");
    const clientSecret = readRequiredEnv("STRAVA_CLIENT_SECRET");
    const authCode = readRequiredEnv("STRAVA_AUTH_CODE");

    const response = await fetch(stravaTokenUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code: authCode,
            grant_type: "authorization_code",
        }),
    });

    if (!response.ok) {
        throw new Error(`Strava auth code exchange failed with status ${response.status}.`);
    }

    const payload = await response.json();

    console.log("Use these values when configuring GitHub:");
    console.log(`STRAVA_REFRESH_TOKEN=${payload.refresh_token}`);
    console.log(`STRAVA_ACCESS_TOKEN=${payload.access_token}`);
    console.log(`STRAVA_ACCESS_TOKEN_EXPIRES_AT=${payload.expires_at}`);
}

main().catch((error) => {
    const message = error instanceof Error ? error.message : "Unknown Strava auth exchange error.";

    console.error(message);
    process.exitCode = 1;
});
