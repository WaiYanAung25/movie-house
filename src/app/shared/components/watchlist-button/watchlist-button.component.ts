import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-watchlist-button',
  standalone: true,
  template: `
    <button
      class="watchlist-btn"
      [class.in-watchlist]="inWatchlist()"
      [attr.aria-label]="inWatchlist() ? 'Remove from watchlist' : 'Add to watchlist'"
      [attr.aria-pressed]="inWatchlist()"
      (click)="toggle.emit(); $event.preventDefault(); $event.stopPropagation()"
      type="button"
    >
      @if (inWatchlist()) {
        <span aria-hidden="true">♥</span>
      } @else {
        <span aria-hidden="true">♡</span>
      }
    </button>
  `,
  styles: [`
    .watchlist-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #888;
      padding: 4px;
      line-height: 1;
      transition: color 0.2s, transform 0.2s;
    }
    .watchlist-btn:hover {
      color: #e53935;
      transform: scale(1.1);
    }
    .watchlist-btn.in-watchlist {
      color: #e53935;
    }
    .watchlist-btn:focus-visible {
      outline: 2px solid #6c63ff;
      outline-offset: 2px;
      border-radius: 4px;
    }
  `]
})
export class WatchlistButtonComponent {
  inWatchlist = input<boolean>(false);
  toggle = output<void>();
}
