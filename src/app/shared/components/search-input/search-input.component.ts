import { Component, output, signal, ElementRef, inject, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-search-input',
  standalone: true,
  template: `
    <div class="search-container">
      <label for="search-input" class="sr-only">Search movies</label>
      <input
        #searchInput
        id="search-input"
        type="text"
        class="search-input"
        placeholder="Search movies..."
        [value]="query()"
        (input)="onInput($event)"
        (keyup.escape)="onClear()"
        aria-label="Search movies"
      />
      @if (query()) {
        <button
          class="clear-btn"
          (click)="onClear()"
          aria-label="Clear search"
          type="button"
        >
          ×
        </button>
      }
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .search-container {
      position: relative;
      width: 100%;
    }
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
    .search-input {
      width: 100%;
      padding: 12px 40px 12px 16px;
      border: 2px solid #444;
      border-radius: 8px;
      background: #1a1a2e;
      color: #eee;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    .search-input:focus {
      border-color: #6c63ff;
    }
    .search-input::placeholder {
      color: #888;
    }
    .clear-btn {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #aaa;
      font-size: 1.4rem;
      cursor: pointer;
      padding: 4px 8px;
      line-height: 1;
    }
    .clear-btn:hover {
      color: #fff;
    }
    .clear-btn:focus-visible {
      outline: 2px solid #6c63ff;
      outline-offset: 2px;
      border-radius: 4px;
    }
  `]
})
export class SearchInputComponent implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);

  readonly query = signal('');
  readonly searchChanged = output<string>();

  private inputEl: HTMLInputElement | null = null;

  ngAfterViewInit(): void {
    this.inputEl = this.el.nativeElement.querySelector('input');
  }

  ngOnDestroy(): void {
    // No timers to clean up
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
    this.searchChanged.emit(value);
  }

  onClear(): void {
    this.query.set('');
    if (this.inputEl) {
      this.inputEl.value = '';
      this.inputEl.focus();
    }
    this.searchChanged.emit('');
  }

  setQuery(value: string): void {
    this.query.set(value);
    if (this.inputEl) {
      this.inputEl.value = value;
    }
  }
}
