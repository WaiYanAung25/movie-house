import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <span class="rating" [class.high]="value() >= 7" [class.medium]="value() >= 4 && value() < 7" [class.low]="value() < 4">
      {{ value() > 0 ? (value() | number:'1.1-1') : 'N/A' }}
    </span>
  `,
  styles: [`
    :host { display: inline-block; }
    .rating {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 600;
      background: #333;
      color: #ccc;
    }
    .high { background: #1b5e20; color: #81c784; }
    .medium { background: #e65100; color: #ffb74d; }
    .low { background: #b71c1c; color: #ef9a9a; }
  `]
})
export class RatingComponent {
  value = input.required<number>();
}
