# TACT AI Guardian bridge

Resonance Labs can call the Guardian gateway through a server-only Express router. This keeps provider credentials and Guardian bearer tokens off the browser.

## Mount the router

In the Express server entrypoint, add:

```ts
import tactGuardianRouter from "./server/integrations/tactGuardianRouter";
app.use("/api/tact-guardian", tactGuardianRouter);
```

## Server environment

- `TACT_GUARDIAN_URL`: deployed Guardian gateway origin.
- `TACT_GUARDIAN_TOKEN`: Guardian `APP_TOKEN`.
- `TACT_BRIDGE_TOKEN`: separate strong token required by Resonance clients when calling the bridge.

Never prefix these values with `VITE_` or expose them in browser bundles.

## Endpoints

- `GET /api/tact-guardian/status`
- `POST /api/tact-guardian/chat` with `{ "message": "..." }`
- `POST /api/tact-guardian/actions/prepare` with `{ "action": "...", "payload": {} }`

Send `Authorization: Bearer <TACT_BRIDGE_TOKEN>` to the Resonance bridge. Guardian action preparation is approval-only; it does not execute external actions.

## Operational boundary

Guardian remains a separate Android + gateway product. This adapter does not copy databases, Android signing keys, provider API keys, or private conversation history into Resonance. Set secrets only in the server deployment's encrypted environment settings.
