import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly config = environment;

  get tmdbBaseUrl(): string {
    return this.config.tmdbBaseUrl;
  }

  get tmdbApiKey(): string {
    return this.config.tmdbApiKey;
  }

  get tmdbImageBaseUrl(): string {
    return this.config.tmdbImageBaseUrl;
  }

  get useMockData(): boolean {
    return this.config.useMockData;
  }

  get isProduction(): boolean {
    return this.config.production;
  }
}
