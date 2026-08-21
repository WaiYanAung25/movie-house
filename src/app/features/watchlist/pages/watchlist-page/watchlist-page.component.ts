import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { WatchlistFacade } from '../../facades/watchlist.facade';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ConfigService } from '../../../../core/config/config.service';

@Component({
  selector: 'app-watchlist-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DecimalPipe, EmptyStateComponent],
  template: `
    <div class="watchlist-page">
      <h1>My Watchlist</h1>

      @if (facade.items().length === 0) {
        <app-empty-state
          title="Your watchlist is empty"
          message="Search for movies and add them to your watchlist."
        />
      } @else {
        <p class="count">{{ facade.count() }} movie(s)</p>
        <ul class="watchlist-list" role="list">
          @for (item of facade.items(); track item.id) {
            <li class="watchlist-item">
              <a
                class="item-link"
                [routerLink]="['/movie', item.id]"
                [attr.aria-label]="'View ' + item.title + ' details'"
              >
                <div class="item-poster">
                  @if (item.posterPath) {
                    <img
                      [src]="posterUrl(item.posterPath)"
                      [alt]="item.title + ' poster'"
                      loading="lazy"
                    />
                  } @else {
                    <div class="no-poster" aria-hidden="true">🎬</div>
                  }
                </div>
                <div class="item-info">
                  <h3>{{ item.title }}</h3>
                  <span class="item-year">{{ releaseYear(item.releaseDate) }}</span>
                  <span class="item-rating">⭐ {{ item.voteAverage > 0 ? (item.voteAverage | number:'1.1-1') : 'N/A' }}</span>
                </div>
              </a>
              <button
                class="remove-btn"
                (click)="remove(item.id); $event.preventDefault(); $event.stopPropagation()"
                type="button"
                [attr.aria-label]="'Remove ' + item.title + ' from watchlist'"
              >
                ×
              </button>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [`
    .watchlist-page {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px;
    }
    h1 {
      color: #eee;
      margin-bottom: 16px;
    }
    .count {
      color: #888;
      margin-bottom: 16px;
    }
    .watchlist-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .watchlist-item {
      display: flex;
      align-items: center;
      background: #16213e;
      border-radius: 8px;
      margin-bottom: 8px;
      overflow: hidden;
      transition: background 0.2s;
    }
    .watchlist-item:hover {
      background: #1a2744;
    }
    .item-link {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      text-decoration: none;
      color: inherit;
      padding: 12px;
    }
    .item-link:focus-visible {
      outline: 2px solid #6c63ff;
      outline-offset: -2px;
      border-radius: 8px;
    }
    .item-poster {
      width: 50px;
      height: 75px;
      border-radius: 4px;
      overflow: hidden;
      flex-shrink: 0;
      background: #0f3460;
    }
    .item-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .no-poster {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      opacity: 0.3;
    }
    .item-info {
      flex: 1;
    }
    .item-info h3 {
      margin: 0 0 4px;
      font-size: 1rem;
      color: #eee;
    }
    .item-year {
      color: #888;
      font-size: 0.85rem;
      margin-right: 12px;
    }
    .item-rating {
      color: #ffb74d;
      font-size: 0.85rem;
    }
    .remove-btn {
      background: none;
      border: none;
      color: #888;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 12px 16px;
      line-height: 1;
      align-self: stretch;
    }
    .remove-btn:hover {
      color: #e53935;
      background: rgba(229, 57, 53, 0.1);
    }
    .remove-btn:focus-visible {
      outline: 2px solid #6c63ff;
      outline-offset: -2px;
    }
  `]
})
export class WatchlistPageComponent {
  readonly facade = inject(WatchlistFacade);
  private readonly config = inject(ConfigService);

  posterUrl(path: string): string {
    return `${this.config.tmdbImageBaseUrl}/w92${path}`;
  }

  releaseYear(date: string): string {
    return date ? date.substring(0, 4) : '';
  }

  remove(movieId: number): void {
    this.facade.removeFromWatchlist(movieId);
  }
}
