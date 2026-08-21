import { TestBed } from '@angular/core/testing';
import { WatchlistFacade } from './watchlist.facade';
import { WatchlistService } from '../services/watchlist.service';
import { WatchlistItem } from '../../../models/movie.model';

describe('WatchlistFacade', () => {
  let facade: WatchlistFacade;
  let service: WatchlistService;

  const mockMovie: WatchlistItem = {
    id: 1,
    title: 'Test Movie',
    posterPath: '/poster.jpg',
    releaseDate: '2024-01-01',
    voteAverage: 8.0,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    facade = TestBed.inject(WatchlistFacade);
    service = TestBed.inject(WatchlistService);
    localStorage.clear();
    service['itemsSignal'].set([]);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should add movie to watchlist', () => {
    facade.addToWatchlist(mockMovie);
    expect(facade.count()).toBe(1);
    expect(facade.isInWatchlist(1)).toBeTrue();
  });

  it('should remove movie from watchlist', () => {
    facade.addToWatchlist(mockMovie);
    facade.removeFromWatchlist(1);
    expect(facade.count()).toBe(0);
    expect(facade.isInWatchlist(1)).toBeFalse();
  });

  it('should toggle watchlist', () => {
    facade.toggleWatchlist(mockMovie);
    expect(facade.count()).toBe(1);

    facade.toggleWatchlist(mockMovie);
    expect(facade.count()).toBe(0);
  });

  it('should expose items signal', () => {
    facade.addToWatchlist(mockMovie);
    expect(facade.items().length).toBe(1);
    expect(facade.items()[0].title).toBe('Test Movie');
  });

  it('should expose count signal', () => {
    expect(facade.count()).toBe(0);
    facade.addToWatchlist(mockMovie);
    expect(facade.count()).toBe(1);
  });
});
