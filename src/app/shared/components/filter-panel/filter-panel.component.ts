import { Component, input, output, signal, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="filters" role="group" aria-label="Search filters">
      <div class="filter-group">
        <label for="filter-year">Year</label>
        <select
          id="filter-year"
          [ngModel]="year()"
          (ngModelChange)="onYearChange($event)"
        >
          <option value="">Any Year</option>
          @for (y of yearOptions; track y) {
            <option [value]="y">{{ y }}</option>
          }
        </select>
      </div>
      <div class="filter-group">
        <label for="filter-rating">Min Rating</label>
        <select
          id="filter-rating"
          [ngModel]="minRating()"
          (ngModelChange)="onMinRatingChange($event)"
        >
          <option value="">Any Rating</option>
          @for (r of ratingOptions; track r.value) {
            <option [value]="r.value">{{ r.label }}</option>
          }
        </select>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .filters {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    label {
      font-size: 0.8rem;
      color: #aaa;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    select {
      padding: 8px 12px;
      border: 1px solid #444;
      border-radius: 6px;
      background: #1a1a2e;
      color: #eee;
      font-size: 0.9rem;
      cursor: pointer;
      outline: none;
      min-width: 120px;
    }
    select:focus-visible {
      outline: 2px solid #6c63ff;
      outline-offset: 2px;
    }
  `]
})
export class FilterPanelComponent implements OnInit, OnChanges {
  year = input<string>('');
  minRating = input<string>('');

  yearChanged = output<string>();
  minRatingChanged = output<string>();

  yearOptions: string[] = [];
  ratingOptions = [
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' },
    { value: '6', label: '6+' },
    { value: '7', label: '7+' },
    { value: '8', label: '8+' },
    { value: '9', label: '9+' },
  ];

  ngOnInit(): void {
    this.initYearOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['year']) {
      // sync
    }
  }

  private initYearOptions(): void {
    const currentYear = new Date().getFullYear();
    const years: string[] = [];
    for (let y = currentYear; y >= 1920; y--) {
      years.push(y.toString());
    }
    this.yearOptions = years;
  }

  onYearChange(value: string): void {
    this.yearChanged.emit(value);
  }

  onMinRatingChange(value: string): void {
    this.minRatingChanged.emit(value);
  }
}
