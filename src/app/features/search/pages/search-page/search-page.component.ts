import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchFacade } from '../../facades/search.facade';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { FilterPanelComponent } from '../../../../shared/components/filter-panel/filter-panel.component';
import { MovieGridComponent } from '../../../../shared/components/movie-grid/movie-grid.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SearchInputComponent,
    FilterPanelComponent,
    MovieGridComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  template: `
    <div class="search-page">
      <h1 class="sr-only">Search Movies</h1>

      <div class="controls">
        <app-search-input
          #searchInput
          (searchChanged)="onSearchChanged($event)"
        />
        <app-filter-panel
          [year]="currentYear()"
          [minRating]="currentMinRating()"
          (yearChanged)="onYearChanged($event)"
          (minRatingChanged)="onMinRatingChanged($event)"
        />
      </div>

      @if (facade.loading()) {
        <app-loading-state />
      } @else if (facade.error()) {
        <app-error-state
          [error]="facade.error()!"
          (retry)="retrySearch()"
        />
      } @else if (facade.results().length === 0 && hasSearched()) {
        <app-empty-state
          title="No movies found"
          message="Try adjusting your search or filters."
        />
      } @else if (facade.results().length > 0) {
        @if (!hasSearched()) {
          <h2 class="section-title">Popular Movies</h2>
        } @else {
          <div class="results-info" aria-live="polite">
            <p>{{ facade.totalResults() }} results found</p>
          </div>
        }
        <app-movie-grid [movies]="facade.results()" />
        @if (facade.hasMore() && hasSearched()) {
          <div class="load-more">
            <button
              class="load-more-btn"
              (click)="loadMore()"
              [disabled]="loadingMore()"
              type="button"
              aria-label="Load more results"
            >
              @if (loadingMore()) {
                Loading...
              } @else {
                Load More
              }
            </button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
    .search-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }
    .controls {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 32px;
    }
    .section-title {
      font-size: 1.4rem;
      color: #ccc;
      margin: 0 0 20px;
    }
    .results-info {
      margin-bottom: 16px;
      color: #888;
      font-size: 0.9rem;
    }
    .results-info p { margin: 0; }
    .load-more {
      display: flex;
      justify-content: center;
      margin-top: 32px;
    }
    .load-more-btn {
      padding: 12px 32px;
      background: #6c63ff;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      font-weight: 500;
    }
    .load-more-btn:hover:not(:disabled) {
      background: #5a52d5;
    }
    .load-more-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .load-more-btn:focus-visible {
      outline: 2px solid #6c63ff;
      outline-offset: 2px;
    }
  `]
})
export class SearchPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly facade = inject(SearchFacade);

  readonly currentYear = signal('');
  readonly currentMinRating = signal('');
  readonly loadingMore = signal(false);
  readonly hasSearched = signal(false);

  private lastQuery = '';
  private isProgrammaticUpdate = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (this.isProgrammaticUpdate) {
        this.isProgrammaticUpdate = false;
        return;
      }

      const query = params['query'] || '';
      const year = params['year'] || '';
      const minRating = params['minRating'] || '';

      this.lastQuery = query;
      this.currentYear.set(year);
      this.currentMinRating.set(minRating);
      this.hasSearched.set(!!query.trim());

      if (query) {
        this.facade.search(query, year, minRating);
      } else {
        this.facade.loadPopular(year, minRating);
      }
    });
  }

  onSearchChanged(query: string): void {
    this.lastQuery = query;
    this.hasSearched.set(!!query.trim());
    this.updateUrl(query, this.currentYear(), this.currentMinRating());
    if (query.trim()) {
      this.facade.search(query, this.currentYear(), this.currentMinRating());
    } else {
      this.facade.loadPopular(this.currentYear(), this.currentMinRating());
    }
  }

  onYearChanged(year: string): void {
    this.currentYear.set(year);
    this.updateUrl(this.lastQuery, year, this.currentMinRating());
    if (this.lastQuery) {
      this.facade.search(this.lastQuery, year, this.currentMinRating());
    } else {
      this.facade.loadPopular(year, this.currentMinRating());
    }
  }

  onMinRatingChanged(minRating: string): void {
    this.currentMinRating.set(minRating);
    this.updateUrl(this.lastQuery, this.currentYear(), minRating);
    if (this.lastQuery) {
      this.facade.search(this.lastQuery, this.currentYear(), minRating);
    } else {
      this.facade.loadPopular(this.currentYear(), minRating);
    }
  }

  loadMore(): void {
    this.loadingMore.set(true);
    this.facade.loadMore(this.lastQuery, this.currentYear(), this.currentMinRating());
    setTimeout(() => this.loadingMore.set(false), 500);
  }

  retrySearch(): void {
    if (this.lastQuery) {
      this.facade.search(this.lastQuery, this.currentYear(), this.currentMinRating());
    } else {
      this.facade.loadPopular(this.currentYear(), this.currentMinRating());
    }
  }

  private updateUrl(query: string, year: string, minRating: string): void {
    const queryParams: Record<string, string> = {};
    if (query) queryParams['query'] = query;
    if (year) queryParams['year'] = year;
    if (minRating) queryParams['minRating'] = minRating;

    this.isProgrammaticUpdate = true;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true,
    });
  }
}
