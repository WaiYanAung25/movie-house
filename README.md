# MovieHouse — Angular Movie Watchlist

A production-quality Angular 20 SPA for searching, exploring, and managing a personal movie watchlist. Built with standalone components, signals-based reactivity, and clean architectural boundaries.

## Project Overview

MovieHouse allows users to:

- **Search movies** by title with debounced input and URL-synchronized filters (year, minimum rating)
- **View movie details** including poster, overview, genres, top 5 cast, and recommendations carousel
- **Manage a watchlist** with localStorage persistence and reactive header badge
- **Navigate seamlessly** with lazy-loaded routes, back/forward support, and URL query parameter state

The app supports both **TMDB API** mode and **mock data** mode for development and testing without an API key.

## Architecture

```
src/app/
├── core/                          # Singleton services, interceptors, config
│   ├── config/                    # Environment-based configuration service
│   ├── interceptors/              # API key injection + error mapping
│   ├── errors/                    # Centralized error types and factory
│   ├── mocks/                     # Mock data for offline development
│   └── services/                  # StorageService (localStorage wrapper)
├── shared/                        # Reusable presentational components
│   └── components/
│       ├── header/                # Navigation bar with watchlist badge
│       ├── movie-card/            # Clickable movie poster card
│       ├── movie-grid/            # Responsive grid of movie cards
│       ├── search-input/          # Debounced search input
│       ├── filter-panel/          # Year and rating filter dropdowns
│       ├── loading-state/         # Spinner component
│       ├── empty-state/           # No results message
│       ├── error-state/           # Error display with retry
│       ├── rating/                # Color-coded rating badge
│       └── watchlist-button/      # Toggle watchlist heart button
├── models/                        # Strongly-typed interfaces
│   ├── movie.model.ts             # Domain models (MovieDetails, CastMember, etc.)
│   └── api.model.ts               # API DTOs (TmdbSearchResponse, etc.)
├── features/
│   ├── search/                    # Search feature
│   │   ├── pages/search-page/     # Search page with filters + load more
│   │   ├── services/              # MovieApiService (real + mock fallback)
│   │   └── facades/               # SearchFacade (state orchestration)
│   ├── details/                   # Movie details feature
│   │   ├── pages/movie-details-page/  # Full movie details view + recommendations carousel
│   │   ├── services/              # MovieDetailsApiService (real + mock fallback)
│   │   └── facades/               # MovieDetailsFacade
│   └── watchlist/                 # Watchlist feature
│       ├── pages/watchlist-page/  # Watchlist view
│       ├── services/              # WatchlistService (localStorage)
│       └── facades/               # WatchlistFacade
├── app.routes.ts                  # Lazy-loaded route definitions
├── app.config.ts                  # Application providers
└── app.component.ts               # Root component with header + router outlet
```

### Key Boundaries

- **Components** never call `HttpClient` directly — they go through **Facades**
- **Facades** orchestrate state (signals) and delegate data fetching to **Services**
- **Services** handle HTTP calls or localStorage, isolated from the UI
- **Presentational components** receive data via `@Input` signals and emit via `@Output` events
- **API services** check `ConfigService.useMockData` and return mock data when no API key is available

## Reactive Approach

### Why Signals?

Angular Signals provide fine-grained reactivity with minimal boilerplate. They integrate well with `computed()` for derived state and `effect()` for side effects, while remaining compatible with RxJS at the HTTP boundary.

### Signal Usage

| Signal | Location | Purpose |
|--------|----------|---------|
| `results`, `loading`, `error`, `totalResults` | `SearchFacade` | Search state |
| `details`, `cast`, `recommendations` | `MovieDetailsFacade` | Details state |
| `items`, `count` | `WatchlistService` | Watchlist state |
| `query` | `SearchInputComponent` | Input value |

### RxJS at the HTTP Boundary

RxJS is used only where Angular APIs return Observables:
- `HttpClient` calls use `pipe()`, `map()`, `catchError()`
- `debounceTime`, `distinctUntilChanged`, `switchMap` in the search stream
- Angular `ActivatedRoute.queryParams` Observable for URL sync

Manual subscriptions are avoided — signals handle all derived UI state.

## Data Flow

```
Component → Facade → Data Service → HTTP / localStorage
  ↑              ↑         ↑
  │ Outputs      │ Signals │ Observable
  │              │         │
  └── Inputs ────┘─────────┘
```

1. User interaction triggers a method call on the component
2. Component calls the corresponding Facade method
3. Facade manages loading/error signals and delegates to the Data Service
4. Data Service performs HTTP request or localStorage operation
5. Facade updates signals, which automatically propagate to the template

## Caching

### Search Cache

- **Key**: `query|year|minRating|page`
- **TTL**: 5 minutes
- **Strategy**: In-memory `Map` on `SearchFacade`
- Navigating back to search with the same filters returns cached results

### Details Cache

- **Key**: `movieId`
- **TTL**: 10 minutes
- **Strategy**: In-memory `Map` on `MovieDetailsFacade`
- Revisiting a movie details page uses cached data if still valid

## Error Handling

### Centralized Error Interceptor

The `errorInterceptor` maps HTTP errors to user-friendly `AppError` objects:

| HTTP Status | Error Code | Message | Retryable |
|-------------|-----------|---------|-----------|
| 401/403 | `UNAUTHORIZED` | Invalid API key | No |
| 404 | `NOT_FOUND` | Resource not found | No |
| 429 | `RATE_LIMITED` | Too many requests | Yes |
| 5xx | `SERVER_ERROR` | Server error | Yes |
| Network | `NETWORK_ERROR` | Check connection | Yes |
| Unknown | `UNKNOWN` | Unexpected error | Yes |

### Error Display

- `ErrorStateComponent` renders the error message
- Retryable errors show a "Try Again" button
- Non-retryable errors show the message only
- No raw HTTP errors are exposed to users

## Routing

### Lazy Loading

All feature routes use `loadComponent()` for code splitting:

```typescript
{ path: 'search', loadComponent: () => import('./features/search/...') }
{ path: 'movie/:id', loadComponent: () => import('./features/details/...') }
{ path: 'watchlist', loadComponent: () => import('./features/watchlist/...') }
```

### URL Query Parameters

Search filters are synced with URL query parameters:

```
/search?query=batman&year=2025&minRating=7
```

- `ActivatedRoute.queryParams` restores search state on page load
- `router.navigate([], { queryParams })` updates the URL on filter change
- Browser back/forward navigation restores previous search state
- `replaceUrl: true` avoids polluting browser history

## Performance

- **OnPush change detection** on all presentational and page components
- **Angular `@for` with `track`** for efficient list diffing
- **Lazy-loaded routes** for code splitting (search, details, watchlist)
- **Debounced search** (300ms) prevents excessive API calls
- **Request cancellation** via RxJS `switchMap` (implicit in search stream)
- **In-memory caching** avoids redundant API calls
- **`loading="lazy"`** on images for below-the-fold content
- **Proper image sizing** using TMDB `w342` and `w185` endpoints

## Accessibility

- **Semantic HTML**: `<header>`, `<nav>`, `<main>`, `<section>`, `<ul>`, `<li>`
- **ARIA labels**: Search input, filter controls, retry button, watchlist button
- **ARIA roles**: `role="status"` for loading/empty states, `role="alert"` for errors
- **ARIA live regions**: `aria-live="polite"` for search results count
- **Keyboard navigation**: All interactive elements are focusable with `focus-visible` outlines
- **No clickable divs**: All interactive elements use `<a>` or `<button>`
- **Screen reader text**: `.sr-only` class for hidden labels
- **`alt` text**: Meaningful alt text on all images

## Testing

### Test Strategy

- **Unit tests** for services, facades, and error models
- **Integration tests** for component creation with TestBed
- **Focus on behavior** over implementation details

### Test Coverage

| Module | Tests |
|--------|-------|
| `AppComponent` | Component creation |
| `StorageService` | CRUD, malformed data, error handling |
| `WatchlistService` | Add/remove/toggle, duplicates, persistence, malformed data |
| `WatchlistFacade` | Add/remove/toggle, signals, count |
| `MovieDetailsFacade` | Initial state, clear |
| `SearchFacade` | Initial state, empty query, clear |
| `MovieApiService` | Search, year filter, empty results |
| `AppError` | All error codes and retryable flags |

### Running Tests

```bash
npm test                          # Watch mode
npm test -- --watch=false         # Single run
npm test -- --browsers=ChromeHeadless  # Headless Chrome
```

## Environment Setup

### TMDB API Key

1. Get a free API key from [themoviedb.org](https://www.themoviedb.org/settings/api)
2. Set it in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  tmdbApiKey: 'YOUR_API_KEY_HERE',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p',
  useMockData: false,
};
```

### Mock Mode

When `tmdbApiKey` is empty or `useMockData` is `true`, the app uses mock data from `src/app/core/mocks/mock-movies.data.ts`. No API key required for development.

Mock data includes:
- 12 search results (Fight Club, Pulp Fiction, Inception, etc.)
- 8 popular movies (Dune, Kung Fu Panda 4, Godzilla x Kong, etc.)
- Movie details with cast and recommendations
- Year filtering applied client-side on mock data

### Development

```bash
npm install
npm start      # Starts dev server at http://localhost:4200
```

### Production Build

```bash
npm run build  # Output in dist/movie-house/
```

## Trade-offs

1. **No SSR**: Client-side rendering chosen for simplicity; SSR could improve initial load and SEO
2. **No NgRx**: Signals + Facades provide sufficient state management without the overhead of a full state library
3. **Functional interceptors**: Angular 20 prefers `HttpInterceptorFn` over class-based interceptors
4. **Mock data in code**: Static mock data is co-located with the app; a full mock server (e.g., MSW) would be more realistic but adds complexity
5. **No infinite scroll**: Load More button chosen for reliability; infinite scroll adds complexity with intersection observers and cleanup
6. **No e2e tests**: Unit and integration tests provide sufficient coverage for the scope of this project
7. **Component style budget warning**: Some inline styles exceed Angular's default 2KB budget — acceptable for standalone components
8. **In-memory caching**: Search and details caches are not persisted; page refresh clears them

## License

MIT
