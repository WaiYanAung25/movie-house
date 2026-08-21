import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { ConfigService } from '../../../core/config/config.service';
import { TmdbMovieDetailsResponse } from '../../../models/api.model';
import { MovieDetails, CastMember } from '../../../models/movie.model';
import { MOCK_MOVIE_DETAILS, MOCK_CAST, MOCK_RECOMMENDATIONS } from '../../../core/mocks/mock-movies.data';

@Injectable({ providedIn: 'root' })
export class MovieDetailsApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  getMovieDetails(id: number): Observable<{
    details: MovieDetails;
    cast: CastMember[];
    recommendations: MovieDetails[];
  }> {
    if (this.config.useMockData) {
      return this.getMockMovieDetails(id);
    }

    const url = `${this.config.tmdbBaseUrl}/movie/${id}`;
    return this.http
      .get<TmdbMovieDetailsResponse>(url, { params: { append_to_response: 'credits,recommendations' } })
      .pipe(
        map((response) => ({
          details: this.mapDetails(response),
          cast: this.mapCast(response.credits.cast.slice(0, 5)),
          recommendations: response.recommendations.results.slice().map((r) => ({
            id: r.id,
            title: r.title,
            posterPath: r.poster_path,
            releaseDate: r.release_date,
            voteAverage: r.vote_average,
            overview: r.overview,
            genres: [],
            runtime: null,
            tagline: '',
          })),
        }))
      );
  }

  private getMockMovieDetails(id: number): Observable<{
    details: MovieDetails;
    cast: CastMember[];
    recommendations: MovieDetails[];
  }> {
    const details = { ...MOCK_MOVIE_DETAILS, id };
    return of({
      details,
      cast: MOCK_CAST,
      recommendations: MOCK_RECOMMENDATIONS,
    });
  }

  private mapDetails(r: TmdbMovieDetailsResponse): MovieDetails {
    return {
      id: r.id,
      title: r.title,
      posterPath: r.poster_path,
      releaseDate: r.release_date,
      voteAverage: r.vote_average,
      overview: r.overview,
      genres: r.genres,
      runtime: r.runtime,
      tagline: r.tagline,
    };
  }

  private mapCast(cast: TmdbMovieDetailsResponse['credits']['cast']): CastMember[] {
    return cast.map((c) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profilePath: c.profile_path,
      order: c.order,
    }));
  }
}
