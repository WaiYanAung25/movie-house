import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SearchFacade } from './search.facade';
import { ConfigService } from '../../../core/config/config.service';

describe('SearchFacade', () => {
  let facade: SearchFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfigService,
        SearchFacade,
      ],
    });
    facade = TestBed.inject(SearchFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should start with empty results', () => {
    expect(facade.results().length).toBe(0);
    expect(facade.loading()).toBeFalse();
    expect(facade.error()).toBeNull();
  });

  it('should clear results', () => {
    facade.clearResults();
    expect(facade.results().length).toBe(0);
    expect(facade.totalResults()).toBe(0);
    expect(facade.totalPages()).toBe(0);
  });

  it('should not search empty query', () => {
    facade.search('');
    expect(facade.loading()).toBeFalse();
    expect(facade.results().length).toBe(0);
  });

  it('should not search whitespace-only query', () => {
    facade.search('   ');
    expect(facade.loading()).toBeFalse();
  });

  it('should have correct filter defaults', () => {
    expect(facade.filters().year).toBe('');
    expect(facade.filters().minRating).toBe('');
  });
});
