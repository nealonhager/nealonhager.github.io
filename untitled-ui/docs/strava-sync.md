# Strava sync setup

This site can publish the latest Strava activities during the GitHub Pages build without exposing Strava credentials to the browser.

## What the automation does

- The root Pages workflow runs on pushes, manual dispatches, and once per day.
- `npm run sync:strava` refreshes a Strava access token, fetches recent activities, saves the raw API response to `.cache/strava-activities-api-response.json`, filters out activities marked private, and writes `public/data/strava-activities.json`.
- The home page reads that generated JSON at runtime.

## Required GitHub secrets

Add these repository secrets before you expect the daily sync to publish activities:

- `STRAVA_CLIENT_ID`
- `STRAVA_CLIENT_SECRET`
- `STRAVA_REFRESH_TOKEN`
- `GH_REPO_ADMIN_TOKEN`

`GH_REPO_ADMIN_TOKEN` is a GitHub personal access token used only to persist the rotated `STRAVA_REFRESH_TOKEN` back into the repository secrets. Strava rotates refresh tokens, so unattended daily syncs are not reliable without this extra GitHub token.

Use a token that can update repository Actions secrets for this repository. A classic token with `repo` scope is the simplest option.

## One-time Strava OAuth bootstrap

1. Create a Strava app in the Strava developer portal.
2. Set the app callback domain to a domain you control for the one-time OAuth redirect.
3. Open an authorize URL like this in your browser, replacing the placeholders:

```text
https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https://YOUR_CALLBACK_DOMAIN/exchange_token&approval_prompt=force&scope=activity:read
```

4. After approving access, copy the `code` query parameter from the redirect URL.
5. From `untitled-ui`, exchange that code for the initial refresh token:

```bash
$env:STRAVA_CLIENT_ID="your-client-id"
$env:STRAVA_CLIENT_SECRET="your-client-secret"
$env:STRAVA_AUTH_CODE="the-code-from-the-redirect"
npm run strava:exchange-code
```

6. Save the printed `STRAVA_REFRESH_TOKEN` into GitHub repository secrets.

## Local testing

You can test the generator locally before relying on the workflow:

```bash
$env:STRAVA_CLIENT_ID="your-client-id"
$env:STRAVA_CLIENT_SECRET="your-client-secret"
$env:STRAVA_REFRESH_TOKEN="your-refresh-token"
npm run sync:strava
```

The generated site output is written to `public/data/strava-activities.json`.
The raw Strava API response is also saved locally to `.cache/strava-activities-api-response.json`, which is gitignored.

## Privacy note

The Strava endpoint used here exposes a `private` flag, but it does not expose a stricter distinction between followers-only and fully public activities. This implementation publishes only activities that are not marked private by the API.
