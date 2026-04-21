Schema Validation: Use a library like Zod to validate incoming WebSocket messages (currently, the server assumes payloads are correctly formatted).
Structured Logging: Replace console.log with a production logger like Pino or Winston to make high-concurrency debugging easier.
Explicit Timeouts: Add explicit timeouts to external API calls in your services to prevent hung sessions.


Real email service — sendLinksToAll is mocked; integrate Resend/SendGrid
GET /api/drive endpoint — dashboard relies on localStorage cache only
Candidate interview result persistence — transcript + score to DriveCandidate
Token rate limiting — protect /login + /signup from brute force
CSV/file upload for batch candidate import