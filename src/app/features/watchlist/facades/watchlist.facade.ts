import { Injectable, inject, computed } from '@angular/core';
import { WatchlistService } from '../services/watchlist.service';
import { WatchlistItem } from '../../../models/movie.model';

@Injectable({ providedIn: 'root' })
export class WatchlistFacade {
  private readonly watchlistService = inject(WatchlistService);

  readonly items = this.watchlistService.items;
  readonly count = this.watchlistService.count;

  isInWatchlist(movieId: number): boolean {
    return this.watchlistService.isInWatchlist(movieId);
  }

  addToWatchlist(item: WatchlistItem): void {
    this.watchlistService.add(item);
  }

  removeFromWatchlist(movieId: number): void {
    this.watchlistService.remove(movieId);
  }

  toggleWatchlist(item: WatchlistItem): void {
    this.watchlistService.toggle(item);
  }
}
