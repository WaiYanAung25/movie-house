import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty" role="status">
      <div class="icon" aria-hidden="true">🎬</div>
      <h3>{{ title() }}</h3>
      @if (message()) {
        <p>{{ message() }}</p>
      }
    </div>
  `,
  styles: [`
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      gap: 12px;
      text-align: center;
      color: #888;
    }
    .icon {
      font-size: 3rem;
      opacity: 0.5;
    }
    h3 {
      margin: 0;
      font-size: 1.2rem;
      color: #aaa;
    }
    p {
      margin: 0;
      font-size: 0.9rem;
    }
  `]
})
export class EmptyStateComponent {
  title = input<string>('No results found');
  message = input<string>('');
}
