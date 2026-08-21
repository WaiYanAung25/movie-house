import { Component, input, output } from '@angular/core';
import { AppError } from '../../../core/errors/app-error.model';

@Component({
  selector: 'app-error-state',
  standalone: true,
  template: `
    <div class="error" role="alert">
      <div class="icon" aria-hidden="true">⚠️</div>
      <h3>Something went wrong</h3>
      <p>{{ error().message }}</p>
      @if (error().retryable) {
        <button
          class="retry-btn"
          (click)="retry.emit()"
          type="button"
          aria-label="Retry request"
        >
          Try Again
        </button>
      }
    </div>
  `,
  styles: [`
    .error {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      gap: 12px;
      text-align: center;
      color: #ccc;
    }
    .icon {
      font-size: 3rem;
      opacity: 0.5;
    }
    h3 {
      margin: 0;
      color: #ef9a9a;
    }
    p {
      margin: 0;
      font-size: 0.9rem;
      color: #999;
      max-width: 400px;
    }
    .retry-btn {
      margin-top: 8px;
      padding: 10px 24px;
      background: #6c63ff;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .retry-btn:hover {
      background: #5a52d5;
    }
    .retry-btn:focus-visible {
      outline: 2px solid #6c63ff;
      outline-offset: 2px;
    }
  `]
})
export class ErrorStateComponent {
  error = input.required<AppError>();
  retry = output<void>();
}
