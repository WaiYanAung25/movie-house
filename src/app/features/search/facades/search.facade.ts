import { Injectable, inject, signal, computed } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, catchError, of } from 'rxjs';
import { MovieApiService } from '../services/search-api.service';
import { MovieSearchResult } from '../../../models/movie.model';
import { AppError } from '../../../core/errors/app-error.model';

interface CacheEntry {
  data: MovieSearchResult[];
  totalPages: number;
  totalResults: number;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class SearchFacade {
  private readonly apiService = inject(MovieApiService);

  private readonly cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL = 5 * 60 * 1000;
  private readonly searchTrigger$ = new Subject<{ query: string; year: string; minRating: string }>();

  readonly results = signal<MovieSearchResult[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<AppError | null>(null);
  readonly totalResults = signal<number>(0);
  readonly currentPage = signal<number>(1);
  readonly totalPages = signal<number>(0);
  readonly hasMore = computed(() => this.currentPage() < this.totalPages());
  readonly filters = signal<{ year: string; minRating: string }>({ year: '', minRating: '' });

  constructor() {
    this.setupSearchStream();
  }

  search(query: string, year: string = '', minRating: string = '', page: number = 1): void {
    if (!query.trim()) {
      this.clearResults();
      return;
    }
    this.filters.set({ year, minRating });
    this.currentPage.set(page);
    this.searchTrigger$.next({ query, year, minRating });
  }

  loadMore(query: string, year: string = '', minRating: string = ''): void {
    const nextPage = this.currentPage() + 1;
    this.currentPage.set(nextPage);
    this.fetchPage(query, year, minRating, nextPage, true);
  }

  loadPopular(year: string = '', minRating: string = ''): void {
    this.filters.set({ year, minRating });
    this.loading.set(true);
    this.error.set(null);

    this.apiService.getPopularMovies(1, year || undefined).pipe(
      catchError((err: AppError) => {
        this.loading.set(false);
        this.error.set(err);
        return of({ results: [] as MovieSearchResult[], totalPages: 0, totalResults: 0 });
      })
    ).subscribe((response) => {
      let filtered = response.results;
      if (minRating) {
        const minRatingNum = parseFloat(minRating);
        filtered = filtered.filter((m) => m.voteAverage >= minRatingNum);
      }
      this.results.set(filtered);
      this.totalPages.set(response.totalPages);
      this.totalResults.set(response.totalResults);
      this.loading.set(false);
    });
  }

  clearResults(): void {
    this.results.set([]);
    this.totalResults.set(0);
    this.totalPages.set(0);
    this.currentPage.set(1);
    this.loading.set(false);
    this.error.set(null);
  }

  private setupSearchStream(): void {
    this.searchTrigger$.pipe(
      debounceTime(300),
      distinctUntilChanged(
        (prev, curr) => prev.query === curr.query && prev.year === curr.year && prev.minRating === curr.minRating
      ),
    ).subscribe(({ query, year, minRating }) => {
      this.fetchPage(query, year, minRating, 1, false);
    });
  }

  private fetchPage(query: string, year: string, minRating: string, page: number, append: boolean): void {
    const cacheKey = `${query}|${year}|${minRating}|${page}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      this.applyResults(cached.data, cached.totalPages, cached.totalResults, append, cached.data.length);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.apiService.searchMovies(query, page, year || undefined).pipe(
      catchError((err: AppError) => {
        this.loading.set(false);
        this.error.set(err);
        return of({ results: [] as MovieSearchResult[], totalPages: 0, totalResults: 0 });
      })
    ).subscribe((response) => {
      this.cache.set(cacheKey, {
        data: response.results,
        totalPages: response.totalPages,
        totalResults: response.totalResults,
        timestamp: Date.now(),
      });

      let filtered = response.results;
      if (minRating) {
        const minRatingNum = parseFloat(minRating);
        filtered = filtered.filter((m) => m.voteAverage >= minRatingNum);
      }

      this.applyResults(filtered, response.totalPages, response.totalResults, append, response.results.length);
    });
  }

  private applyResults(
    data: MovieSearchResult[],
    totalPages: number,
    totalResults: number,
    append: boolean,
    originalCount: number,
  ): void {
    this.loading.set(false);
    if (append) {
      this.results.update((prev) => [...prev, ...data]);
    } else {
      this.results.set(data);
    }
    this.totalPages.set(totalPages);
    this.totalResults.set(totalResults);
  }
}
