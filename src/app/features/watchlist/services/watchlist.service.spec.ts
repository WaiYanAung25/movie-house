import { TestBed } from '@angular/core/testing';
import { WatchlistService } from './watchlist.service';
import { WatchlistItem } from '../../../models/movie.model';

describe('WatchlistService', () => {
  let service: WatchlistService;

  const mockMovie1: WatchlistItem = {
    id: 1,
    title: 'Test Movie 1',
    posterPath: '/poster1.jpg',
    releaseDate: '2024-01-01',
    voteAverage: 8.5,
  };

  const mockMovie2: WatchlistItem = {
    id: 2,
    title: 'Test Movie 2',
    posterPath: '/poster2.jpg',
    releaseDate: '2024-06-15',
    voteAverage: 7.2,
  };

  function createFreshService(): WatchlistService {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    return TestBed.inject(WatchlistService);
  }

  beforeEach(() => {
    localStorage.clear();
    service = createFreshService();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty watchlist', () => {
    expect(service.count()).toBe(0);
    expect(service.items().length).toBe(0);
  });

  it('should add a movie to watchlist', () => {
    service.add(mockMovie1);
    expect(service.count()).toBe(1);
    expect(service.items().length).toBe(1);
    expect(service.items()[0].id).toBe(1);
  });

  it('should not add duplicate movies', () => {
    service.add(mockMovie1);
    service.add(mockMovie1);
    expect(service.count()).toBe(1);
  });

  it('should add different movies', () => {
    service.add(mockMovie1);
    service.add(mockMovie2);
    expect(service.count()).toBe(2);
  });

  it('should remove a movie from watchlist', () => {
    service.add(mockMovie1);
    service.add(mockMovie2);
    service.remove(1);
    expect(service.count()).toBe(1);
    expect(service.items()[0].id).toBe(2);
  });

  it('should handle removing non-existent movie gracefully', () => {
    service.add(mockMovie1);
    service.remove(999);
    expect(service.count()).toBe(1);
  });

  it('should toggle movie on and off', () => {
    service.toggle(mockMovie1);
    expect(service.count()).toBe(1);

    service.toggle(mockMovie1);
    expect(service.count()).toBe(0);
  });

  it('should check if movie is in watchlist', () => {
    service.add(mockMovie1);
    expect(service.isInWatchlist(1)).toBeTrue();
    expect(service.isInWatchlist(2)).toBeFalse();
  });

  it('should persist to localStorage', () => {
    service.add(mockMovie1);
    const stored = localStorage.getItem('movie-house-watchlist');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.length).toBe(1);
    expect(parsed[0].id).toBe(1);
  });

  it('should load from localStorage on init', () => {
    localStorage.setItem('movie-house-watchlist', JSON.stringify([mockMovie1, mockMovie2]));
    const newService = createFreshService();
    expect(newService.count()).toBe(2);
  });

  it('should handle malformed localStorage data gracefully', () => {
    localStorage.setItem('movie-house-watchlist', 'invalid json');
    const newService = createFreshService();
    expect(newService.count()).toBe(0);
  });

  it('should handle non-array localStorage data gracefully', () => {
    localStorage.setItem('movie-house-watchlist', JSON.stringify({ not: 'array' }));
    const newService = createFreshService();
    expect(newService.count()).toBe(0);
  });

  it('should filter out invalid items from localStorage', () => {
    localStorage.setItem('movie-house-watchlist', JSON.stringify([
      mockMovie1,
      { invalid: 'item' },
      null,
      mockMovie2,
    ]));
    const newService = createFreshService();
    expect(newService.count()).toBe(2);
  });
});
