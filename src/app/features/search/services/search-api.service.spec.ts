import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '../../../core/config/config.service';
import { MovieApiService } from './search-api.service';

describe('MovieApiService', () => {
  let service: MovieApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigService, MovieApiService],
    });
    service = TestBed.inject(MovieApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search movies', () => {
    const mockResponse = {
      page: 1,
      results: [
        {
          id: 1,
          title: 'Test Movie',
          poster_path: '/poster.jpg',
          release_date: '2024-01-01',
          vote_average: 8.0,
          overview: 'A test movie',
          genre_ids: [28],
          adult: false,
          original_language: 'en',
          popularity: 50,
        },
      ],
      total_pages: 1,
      total_results: 1,
    };

    service.searchMovies('test').subscribe((result) => {
      expect(result.results.length).toBe(1);
      expect(result.results[0].title).toBe('Test Movie');
      expect(result.results[0].posterPath).toBe('/poster.jpg');
    });

    const req = httpMock.expectOne((r) => r.url.includes('/search/movie'));
    expect(req.request.params.get('query')).toBe('test');
    req.flush(mockResponse);
  });

  it('should include year parameter when provided', () => {
    service.searchMovies('test', 1, '2024').subscribe();

    const req = httpMock.expectOne((r) => r.url.includes('/search/movie'));
    expect(req.request.params.get('year')).toBe('2024');
    req.flush({ page: 1, results: [], total_pages: 0, total_results: 0 });
  });

  it('should handle empty results', () => {
    service.searchMovies('nonexistent').subscribe((result) => {
      expect(result.results.length).toBe(0);
      expect(result.totalResults).toBe(0);
    });

    const req = httpMock.expectOne((r) => r.url.includes('/search/movie'));
    req.flush({ page: 1, results: [], total_pages: 0, total_results: 0 });
  });
});
