import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { WatchlistFacade } from '../../../features/watchlist/facades/watchlist.facade';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header" role="banner">
      <nav aria-label="Main navigation">
        <a routerLink="/" class="logo">🎬 MovieHouse</a>
        <div class="nav-links">
          <a routerLink="/search" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            Search
          </a>
          <a
            routerLink="/watchlist"
            routerLinkActive="active"
            class="watchlist-link"
            aria-label="Watchlist"
          >
            Watchlist
            @if (watchlistFacade.count() > 0) {
              <span class="badge" [attr.aria-label]="watchlistFacade.count() + ' items in watchlist'">
                {{ watchlistFacade.count() }}
              </span>
            }
          </a>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      background: #0f0f23;
      border-bottom: 1px solid #222;
      padding: 0 24px;
    }
    nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
      height: 60px;
    }
    .logo {
      font-size: 1.3rem;
      font-weight: 700;
      color: #6c63ff;
      text-decoration: none;
    }
    .logo:focus-visible {
      outline: 2px solid #6c63ff;
      outline-offset: 4px;
      border-radius: 4px;
    }
    .nav-links {
      display: flex;
      gap: 24px;
      align-items: center;
    }
    .nav-links a {
      text-decoration: none;
      color: #aaa;
      font-size: 0.95rem;
      padding: 8px 0;
      position: relative;
    }
    .nav-links a:hover {
      color: #eee;
    }
    .nav-links a.active {
      color: #6c63ff;
    }
    .nav-links a:focus-visible {
      outline: 2px solid #6c63ff;
      outline-offset: 4px;
      border-radius: 4px;
    }
    .watchlist-link {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .badge {
      background: #e53935;
      color: #fff;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 10px;
      min-width: 20px;
      text-align: center;
    }
  `]
})
export class HeaderComponent {
  readonly watchlistFacade = inject(WatchlistFacade);
}
