# Connect the chapter Instagram feed

The homepage now includes an automatic Instagram media feed. It is **implemented but not connected live**: the user confirmed another officer manages `@texas_acm`. No Instagram account permissions or tokens were available during implementation.

## Account-manager handoff

The officer who manages the chapter account should use a Meta developer app with Instagram API access. Use a professional account and request only the read permission needed by the selected login product; the website does not publish, message, or moderate Instagram. Follow Meta’s [Instagram Login documentation](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/) or the [official Meta API collection](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api) for Facebook Login with a linked Page. App roles/review requirements depend on the chosen app and access level.

Set these **server-only** values in the hosting provider’s secrets/environment settings (and ignored `.env.local` for a local check):

- `INSTAGRAM_USER_ID`: the chapter account ID for the selected login product.
- `INSTAGRAM_ACCESS_TOKEN`: the authorized read token. Never commit it, prefix it with `NEXT_PUBLIC_`, or paste it into a public issue or chat.
- `INSTAGRAM_API_VERSION`: a currently supported version from the Meta app dashboard, including the `v` prefix. The implementation requires an explicit version rather than silently selecting one.
- `INSTAGRAM_LOGIN_TYPE`: `instagram` for Instagram Login; `facebook` for Facebook Login and the linked Page.

Restart/redeploy after setting values. Visit `/api/instagram`: a successful connection returns `status: "connected"` and sanitized posts, with no token. The implementation checks the account’s username is exactly `texas_acm` before publishing its media. Verify the first card is the chapter’s latest post and that a newly published post appears after cache refresh. Do not post test content to Instagram just to verify the website.

## Automatic updates and limits

The server reads profile/media from Meta and caches upstream responses for 15 minutes. Open homepage tabs check again every 15 minutes and when brought back into view; hidden tabs do not poll. Fetch-on-visit caching means this is periodic, not real-time: a new post may take another refresh cycle to appear. No scheduled job or manual website edit is needed for new posts while the token remains valid and the Next.js server is deployed.

The six most recent valid items from the returned media are shown, sorted by timestamp. Photos and carousel covers display their image; Reels use a thumbnail and link to Instagram for playback. It does not mirror Stories, likes, comments, or the whole Instagram profile. Instagram posts do not automatically become events in the officer calendar: dates and RSVP links still need approved officer entry.

The account manager must maintain/renew tokens according to Meta’s expiration/revocation rules and keep the API version supported. Automatic token renewal is not implemented. If authorization expires, account identity does not match, Meta times out, or configuration is missing, the page shows a direct link to `@texas_acm`; archive photos are not labeled as current posts. API errors and credentials are never exposed to visitors or written to application logs by this integration.

Production hosting remains a separate launch requirement. A source branch alone cannot run this server integration.
