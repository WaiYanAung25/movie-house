import { Component, input } from '@angular/core';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MovieSearchResult } from '../../../models/movie.model';

@Component({
  selector: 'app-movie-grid',
  standalone: true,
  imports: [MovieCardComponent],
  template: `
    <div class="grid">
      @for (movie of movies(); track movie.id) {
        <app-movie-card [movie]="movie" />
      }
    </div>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 24px;
    }
    @media (max-width: 480px) {
      .grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 16px;
      }
    }
  `]
})
export class MovieGridComponent {
  movies = input.required<MovieSearchResult[]>();
}
