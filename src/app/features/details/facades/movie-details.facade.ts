import { Injectable, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { MovieDetailsApiService } from '../services/movie-details-api.service';
import { MovieDetails, CastMember } from '../../../models/movie.model';
import { AppError } from '../../../core/errors/app-error.model';

interface CacheEntry {
  details: MovieDetails;
  cast: CastMember[];
  recommendations: MovieDetails[];
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class MovieDetailsFacade {
  private readonly apiService = inject(MovieDetailsApiService);

  private readonly cache = new Map<number, CacheEntry>();
  private readonly CACHE_TTL = 10 * 60 * 1000;

  readonly details = signal<MovieDetails | null>(null);
  readonly cast = signal<CastMember[]>([]);
  readonly recommendations = signal<MovieDetails[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<AppError | null>(null);

  loadMovie(id: number): void {
    const cached = this.cache.get(id);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      this.details.set(cached.details);
      this.cast.set(cached.cast);
      this.recommendations.set(cached.recommendations);
      this.loading.set(false);
      this.error.set(null);
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.details.set(null);
    this.cast.set([]);
    this.recommendations.set([]);

    this.apiService.getMovieDetails(id).pipe(
      catchError((err: AppError) => {
        this.loading.set(false);
        this.error.set(err);
        return of(null);
      })
    ).subscribe((result) => {
      if (!result) return;

      this.cache.set(id, {
        ...result,
        timestamp: Date.now(),
      });

      this.details.set(result.details);
      this.cast.set(result.cast);
      this.recommendations.set(result.recommendations);
      this.loading.set(false);
    });
  }

  clear(): void {
    this.details.set(null);
    this.cast.set([]);
    this.recommendations.set([]);
    this.loading.set(false);
    this.error.set(null);
  }
}
