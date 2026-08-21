import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MovieDetailsFacade } from './movie-details.facade';
import { ConfigService } from '../../../core/config/config.service';

describe('MovieDetailsFacade', () => {
  let facade: MovieDetailsFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfigService,
        MovieDetailsFacade,
      ],
    });
    facade = TestBed.inject(MovieDetailsFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should start with null details', () => {
    expect(facade.details()).toBeNull();
    expect(facade.cast().length).toBe(0);
    expect(facade.recommendations().length).toBe(0);
    expect(facade.loading()).toBeFalse();
    expect(facade.error()).toBeNull();
  });

  it('should clear state', () => {
    facade.clear();
    expect(facade.details()).toBeNull();
    expect(facade.cast().length).toBe(0);
    expect(facade.recommendations().length).toBe(0);
    expect(facade.loading()).toBeFalse();
    expect(facade.error()).toBeNull();
  });
});
