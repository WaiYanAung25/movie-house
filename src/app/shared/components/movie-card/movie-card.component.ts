import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RatingComponent } from '../rating/rating.component';
import { ConfigService } from '../../../core/config/config.service';
import { MovieSearchResult } from '../../../models/movie.model';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [RouterLink, RatingComponent],
  template: `
    <a
      class="card"
      [routerLink]="['/movie', movie().id]"
      [attr.aria-label]="movie().title + ' - ' + releaseYear()"
    >
      <div class="poster">
        @if (movie().posterPath) {
          <img
            [src]="posterUrl()"
            [alt]="movie().title + ' poster'"
            loading="lazy"
          />
        } @else {
          <div class="no-poster" aria-hidden="true">🎬</div>
        }
      </div>
      <div class="info">
        <h3 class="title">{{ movie().title }}</h3>
        <div class="meta">
          <span class="year">{{ releaseYear() }}</span>
          <app-rating [value]="movie().voteAverage" />
        </div>
      </div>
    </a>
  `,
  styles: [`
    :host { display: block; }
    .card {
      display: block;
      text-decoration: none;
      color: inherit;
      border-radius: 8px;
      overflow: hidden;
      background: #16213e;
      transition: transform 0.2s, box-shadow 0.2s;
      height: 100%;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }
    .card:focus-visible {
      outline: 2px solid #6c63ff;
      outline-offset: 2px;
    }
    .poster {
      aspect-ratio: 2/3;
      background: #0f3460;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .no-poster {
      font-size: 2rem;
      opacity: 0.3;
    }
    .info {
      padding: 12px;
    }
    .title {
      margin: 0 0 8px;
      font-size: 0.95rem;
      font-weight: 600;
      color: #eee;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .year {
      color: #888;
      font-size: 0.85rem;
    }
  `]
})
export class MovieCardComponent {
  private readonly config = inject(ConfigService);

  movie = input.required<MovieSearchResult>();

  posterUrl(): string {
    return `${this.config.tmdbImageBaseUrl}/w342${this.movie().posterPath}`;
  }

  releaseYear(): string {
    const date = this.movie().releaseDate;
    return date ? date.substring(0, 4) : 'Unknown';
  }
}
