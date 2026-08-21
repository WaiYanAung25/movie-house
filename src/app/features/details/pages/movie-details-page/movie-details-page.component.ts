import { Component, inject, OnInit, ChangeDetectionStrategy, computed, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieDetailsFacade } from '../../facades/movie-details.facade';
import { WatchlistFacade } from '../../../watchlist/facades/watchlist.facade';
import { RatingComponent } from '../../../../shared/components/rating/rating.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { WatchlistButtonComponent } from '../../../../shared/components/watchlist-button/watchlist-button.component';
import { ConfigService } from '../../../../core/config/config.service';
import { WatchlistItem } from '../../../../models/movie.model';

@Component({
  selector: 'app-movie-details-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RatingComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    WatchlistButtonComponent,
  ],
  template: `
    @if (facade.loading()) {
      <app-loading-state />
    } @else if (facade.error()) {
      <app-error-state
        [error]="facade.error()!"
        (retry)="retry()"
      />
    } @else if (details()) {
      <div class="details-page">
        <div class="hero">
          <div class="poster">
            @if (details()!.posterPath) {
              <img
                [src]="posterUrl(details()!.posterPath!)"
                [alt]="details()!.title + ' poster'"
              />
            } @else {
              <div class="no-poster" aria-hidden="true">🎬</div>
            }
          </div>
          <div class="info">
            <div class="title-row">
              <h1>{{ details()!.title }}</h1>
              <app-watchlist-button
                [inWatchlist]="isInWatchlist(details()!.id)"
                (toggle)="toggleWatchlist(details()!)"
              />
            </div>
            @if (details()!.tagline) {
              <p class="tagline">"{{ details()!.tagline }}"</p>
            }
            <div class="meta-row">
              <span class="year">{{ releaseYear(details()!.releaseDate) }}</span>
              @if (details()!.runtime) {
                <span class="runtime">{{ details()!.runtime }} min</span>
              }
              <app-rating [value]="details()!.voteAverage" />
            </div>
            <div class="genres">
              @for (genre of details()!.genres; track genre.id) {
                <span class="genre-tag">{{ genre.name }}</span>
              }
            </div>
            <div class="overview">
              <h2>Overview</h2>
              <p>{{ details()!.overview }}</p>
            </div>
          </div>
        </div>

        @if (facade.cast().length > 0) {
          <section class="cast-section">
            <h2>Top Cast</h2>
            <div class="cast-grid">
              @for (member of facade.cast(); track member.id) {
                <div class="cast-member">
                  @if (member.profilePath) {
                    <img
                      [src]="profileUrl(member.profilePath)"
                      [alt]="member.name"
                      class="cast-photo"
                      loading="lazy"
                    />
                  } @else {
                    <div class="cast-photo no-photo" aria-hidden="true">👤</div>
                  }
                  <div class="cast-info">
                    <strong>{{ member.name }}</strong>
                    <span>{{ member.character }}</span>
                  </div>
                </div>
              }
            </div>
          </section>
        }

        @if (facade.recommendations().length > 0) {
          <section class="recommendations-section">
            <h2>Recommended Movies</h2>
            <div class="carousel-wrapper">
              <button
                class="carousel-btn carousel-btn-prev"
                (click)="scrollCarousel(-1)"
                type="button"
                aria-label="Scroll left"
              >&#8249;</button>
              <div class="recommendations-carousel" #recCarousel>
                @for (movie of facade.recommendations(); track movie.id) {
                  <a
                    class="rec-card"
                    [routerLink]="['/movie', movie.id]"
                    [attr.aria-label]="'View ' + movie.title"
                  >
                    @if (movie.posterPath) {
                      <img
                        [src]="posterUrl(movie.posterPath)"
                        [alt]="movie.title + ' poster'"
                        loading="lazy"
                      />
                    } @else {
                      <div class="no-poster-small" aria-hidden="true">🎬</div>
                    }
                    <span class="rec-title">{{ movie.title }}</span>
                  </a>
                }
              </div>
              <button
                class="carousel-btn carousel-btn-next"
                (click)="scrollCarousel(1)"
                type="button"
                aria-label="Scroll right"
              >&#8250;</button>
            </div>
          </section>
        }
      </div>
    } @else {
      <app-empty-state title="Movie not found" message="The movie you're looking for doesn't exist." />
    }
  `,
  styles: [`
    .details-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }
    .hero {
      display: flex;
      gap: 32px;
      margin-bottom: 48px;
    }
    .poster {
      flex-shrink: 0;
      width: 300px;
      border-radius: 12px;
      overflow: hidden;
      background: #0f3460;
    }
    .poster img {
      width: 100%;
      height: auto;
      display: block;
    }
    .no-poster {
      aspect-ratio: 2/3;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      opacity: 0.3;
    }
    .info {
      flex: 1;
    }
    .title-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    h1 {
      margin: 0;
      font-size: 2rem;
      color: #eee;
      flex: 1;
    }
    .tagline {
      color: #888;
      font-style: italic;
      margin: 8px 0;
    }
    .meta-row {
      display: flex;
      align-items: center;
      gap: 16px;
      margin: 12px 0;
    }
    .year, .runtime {
      color: #aaa;
      font-size: 0.95rem;
    }
    .genres {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin: 12px 0;
    }
    .genre-tag {
      padding: 4px 12px;
      background: #1a1a2e;
      border: 1px solid #333;
      border-radius: 20px;
      font-size: 0.8rem;
      color: #aaa;
    }
    .recommendations-section h2 {
      font-size: 1.2rem;
      color: #ccc;
      margin: 24px 0 12px;
    }
    .carousel-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .carousel-btn {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid #444;
      background: #1a1a2e;
      color: #eee;
      font-size: 1.4rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, border-color 0.2s;
      z-index: 1;
    }
    .carousel-btn:hover {
      background: #6c63ff;
      border-color: #6c63ff;
    }
    .carousel-btn:focus-visible {
      outline: 2px solid #6c63ff;
      outline-offset: 2px;
    }
    .carousel-btn-prev {
      margin-right: 8px;
    }
    .carousel-btn-next {
      margin-left: 8px;
    }
    .recommendations-carousel {
      display: flex;
      gap: 16px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 8px;
      scrollbar-width: none;
    }
    .recommendations-carousel::-webkit-scrollbar {
      display: none;
    }
    .overview p {
      color: #bbb;
      line-height: 1.6;
      margin: 0;
    }
    .cast-grid {
      display: flex;
      gap: 20px;
      overflow-x: auto;
      padding-bottom: 8px;
    }
    .cast-member {
      flex-shrink: 0;
      width: 100px;
      text-align: center;
    }
    .cast-photo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      margin: 0 auto 8px;
      display: block;
      background: #0f3460;
    }
    .no-photo {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
    }
    .cast-info {
      font-size: 0.8rem;
    }
    .cast-info strong {
      display: block;
      color: #eee;
      font-size: 0.85rem;
    }
    .cast-info span {
      color: #888;
    }
    .rec-card {
      flex-shrink: 0;
      width: 140px;
      text-decoration: none;
      color: inherit;
      border-radius: 8px;
      overflow: hidden;
      background: #16213e;
      transition: transform 0.2s;
      scroll-snap-align: start;
    }
    .rec-card:hover {
      transform: translateY(-2px);
    }
    .rec-card:focus-visible {
      outline: 2px solid #6c63ff;
      outline-offset: 2px;
    }
    .rec-card img {
      width: 100%;
      aspect-ratio: 2/3;
      object-fit: cover;
      display: block;
    }
    .no-poster-small {
      aspect-ratio: 2/3;
      background: #0f3460;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      opacity: 0.3;
    }
    .rec-title {
      display: block;
      padding: 8px;
      font-size: 0.8rem;
      color: #ccc;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @media (max-width: 768px) {
      .hero {
        flex-direction: column;
        align-items: center;
      }
      .poster {
        width: 200px;
      }
      .title-row {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
    }
  `]
})
export class MovieDetailsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly config = inject(ConfigService);
  readonly facade = inject(MovieDetailsFacade);
  private readonly watchlistFacade = inject(WatchlistFacade);
  readonly details = computed(() => this.facade.details());
  @ViewChild('recCarousel') recCarousel!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = Number(params['id']);
      if (id) {
        this.facade.loadMovie(id);
      }
    });
  }

  posterUrl(path: string): string {
    return `${this.config.tmdbImageBaseUrl}/w342${path}`;
  }

  profileUrl(path: string): string {
    return `${this.config.tmdbImageBaseUrl}/w185${path}`;
  }

  releaseYear(date: string): string {
    return date ? date.substring(0, 4) : 'Unknown';
  }

  isInWatchlist(movieId: number): boolean {
    return this.watchlistFacade.isInWatchlist(movieId);
  }

  toggleWatchlist(details: { id: number; title: string; posterPath: string | null; releaseDate: string; voteAverage: number }): void {
    const item: WatchlistItem = {
      id: details.id,
      title: details.title,
      posterPath: details.posterPath,
      releaseDate: details.releaseDate,
      voteAverage: details.voteAverage,
    };
    this.watchlistFacade.toggleWatchlist(item);
  }

  retry(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (id) {
      this.facade.loadMovie(id);
    }
  }

  scrollCarousel(direction: number): void {
    if (this.recCarousel) {
      const scrollAmount = 300;
      this.recCarousel.nativeElement.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth',
      });
    }
  }
}
