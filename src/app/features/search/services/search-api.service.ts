import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { ConfigService } from '../../../core/config/config.service';
import { TmdbSearchResponse, TmdbMovieResult } from '../../../models/api.model';
import { MovieSearchResult } from '../../../models/movie.model';
import { MOCK_SEARCH_RESULTS, MOCK_POPULAR_RESULTS } from '../../../core/mocks/mock-movies.data';

@Injectable({ providedIn: 'root' })
export class MovieApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  private readonly searchUrl = `${this.config.tmdbBaseUrl}/search/movie`;
  private readonly discoverUrl = `${this.config.tmdbBaseUrl}/discover/movie`;

  searchMovies(
    query: string,
    page: number = 1,
    year?: string,
  ): Observable<{ results: MovieSearchResult[]; totalPages: number; totalResults: number }> {
    if (this.config.useMockData) {
      return this.getMockSearchResults(query, year);
    }

    let params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('include_adult', 'false');

    if (year) {
      params = params.set('year', year);
    }

    return this.http.get<TmdbSearchResponse>(this.searchUrl, { params }).pipe(
      map((response) => ({
        results: response.results.map(this.mapResult),
        totalPages: response.total_pages,
        totalResults: response.total_results,
      }))
    );
  }

  getPopularMovies(
    page: number = 1,
    year?: string,
  ): Observable<{ results: MovieSearchResult[]; totalPages: number; totalResults: number }> {
    if (this.config.useMockData) {
      return this.getMockPopularResults(year);
    }

    let params = new HttpParams()
      .set('sort_by', 'popularity.desc')
      .set('page', page.toString())
      .set('include_adult', 'false');

    if (year) {
      params = params.set('primary_release_year', year);
    }

    return this.http.get<TmdbSearchResponse>(this.discoverUrl, { params }).pipe(
      map((response) => ({
        results: response.results.map(this.mapResult),
        totalPages: response.total_pages,
        totalResults: response.total_results,
      }))
    );
  }

  private getMockSearchResults(
    query: string,
    year?: string,
  ): Observable<{ results: MovieSearchResult[]; totalPages: number; totalResults: number }> {
    let results = MOCK_SEARCH_RESULTS.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );

    if (year) {
      results = results.filter((movie) => movie.releaseDate.startsWith(year));
    }

    return of({
      results,
      totalPages: 1,
      totalResults: results.length,
    });
  }

  private getMockPopularResults(
    year?: string,
  ): Observable<{ results: MovieSearchResult[]; totalPages: number; totalResults: number }> {
    let results = [...MOCK_POPULAR_RESULTS];

    if (year) {
      results = results.filter((movie) => movie.releaseDate.startsWith(year));
    }

    return of({
      results,
      totalPages: 1,
      totalResults: results.length,
    });
  }

  private mapResult(item: TmdbMovieResult): MovieSearchResult {
    return {
      id: item.id,
      title: item.title,
      posterPath: item.poster_path,
      releaseDate: item.release_date,
      voteAverage: item.vote_average,
      overview: item.overview,
    };
  }
}
