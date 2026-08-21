import { Injectable, inject, signal, computed } from '@angular/core';
import { WatchlistItem } from '../../../models/movie.model';
import { StorageService } from '../../../core/services/storage.service';

const WATCHLIST_KEY = 'movie-house-watchlist';

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private readonly storage = inject(StorageService);
  private readonly itemsSignal = signal<WatchlistItem[]>(this.loadFromStorage());

  readonly items = this.itemsSignal.asReadonly();
  readonly count = computed(() => this.itemsSignal().length);

  isInWatchlist(movieId: number): boolean {
    return this.itemsSignal().some((item) => item.id === movieId);
  }

  add(item: WatchlistItem): void {
    if (this.isInWatchlist(item.id)) return;
    const updated = [...this.itemsSignal(), item];
    this.itemsSignal.set(updated);
    this.persist(updated);
  }

  remove(movieId: number): void {
    const updated = this.itemsSignal().filter((item) => item.id !== movieId);
    this.itemsSignal.set(updated);
    this.persist(updated);
  }

  toggle(item: WatchlistItem): void {
    if (this.isInWatchlist(item.id)) {
      this.remove(item.id);
    } else {
      this.add(item);
    }
  }

  private persist(items: WatchlistItem[]): void {
    this.storage.setItem(WATCHLIST_KEY, items);
  }

  private loadFromStorage(): WatchlistItem[] {
    const items = this.storage.getItem<WatchlistItem[]>(WATCHLIST_KEY);
    if (!items || !Array.isArray(items)) return [];
    return items.filter(
      (item): item is WatchlistItem =>
        item !== null &&
        typeof item === 'object' &&
        typeof item.id === 'number' &&
        typeof item.title === 'string'
    );
  }
}
