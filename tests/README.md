# Tests

Smoke coverage for the [expandtesting Notes app](https://practice.expandtesting.com/notes/app/)
and its [REST API](https://practice.expandtesting.com/notes/api/api-docs/).

## Layout

| Path              | What                                                            |
| ----------------- | -------------------------------------------------------------- |
| `api/`            | API smoke specs — hit the Notes REST API directly              |
| `ui/`             | UI / E2E smoke specs — drive the web app in a browser          |
| `helpers/api.ts`  | `NotesApi` — typed wrapper over the REST endpoints             |
| `../pages/`       | Page objects at project root, one per file: `login-page.ts`, `register-page.ts`, `notes-page.ts` |
| `helpers/data.ts` | `makeUser()` / `makeNote()` factories (unique data per run)    |
| `fixtures/baseFixture.ts` | Custom `test` with `api` / `testUser` / `authedNotesPage` fixtures |

Every test is tagged `@smoke` plus `@api` or `@ui`.

## Running

```bash
npm test                 # everything
npm run test:smoke       # --grep @smoke
npm run test:smoke:api   # API smoke only
npm run test:smoke:ui    # UI smoke only
npm run report           # open the last HTML report
```

## Notes on the environment

- `BASE_URL` / `API_URL` come from `.env` (see `.env.example`); both fall back
  to the public practice site.
- Each test registers its own throwaway user (`*@example.com`) via the API and
  deletes the account in teardown, so runs are isolated and leave no state.
- The practice site embeds Google AdSense iframes that overlap real controls;
  the `page` fixture blocks ad/analytics hosts so clicks land reliably.
