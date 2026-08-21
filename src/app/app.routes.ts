import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full',
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/pages/search-page/search-page.component').then(
        (m) => m.SearchPageComponent
      ),
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./features/details/pages/movie-details-page/movie-details-page.component').then(
        (m) => m.MovieDetailsPageComponent
      ),
  },
  {
    path: 'watchlist',
    loadComponent: () =>
      import('./features/watchlist/pages/watchlist-page/watchlist-page.component').then(
        (m) => m.WatchlistPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'search',
  },
];
