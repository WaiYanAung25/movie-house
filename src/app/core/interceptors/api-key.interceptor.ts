import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigService } from '../config/config.service';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(ConfigService);

  if (!req.url.includes('api.themoviedb.org')) {
    return next(req);
  }

  const cloned = req.clone({
    params: req.params.set('api_key', config.tmdbApiKey),
  });

  return next(cloned);
};
