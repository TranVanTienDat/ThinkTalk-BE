import {
  CACHE_KEY_METADATA,
  CACHE_MANAGER,
  CACHE_TTL_METADATA,
  CacheInterceptor,
  CacheTTL,
} from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of, tap } from 'rxjs';
import { CACHE_BY_USER } from '../decorators/public.decorator';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const params = request;
    const cacheKey = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );
    const cacheForEachUser = this.reflector.get(
      CACHE_BY_USER,
      context.getHandler(),
    );
    if (request?.user && cacheForEachUser) {
      return `user:${request.user.id}_${cacheKey}`;
    }

    return cacheKey;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const key = this.trackBy(context);
    if (!key) {
      return next.handle();
    }

    const ttl =
      this.reflector.get(CACHE_TTL_METADATA, context.getHandler()) ?? 0;

    const cachedResponse = await this.cacheManager.get(key);

    if (cachedResponse) {
      return of(cachedResponse);
    }

    return next.handle().pipe(
      tap(async (response) => {
        await this.cacheManager.set(key, response, ttl);
      }),
    );
  }
}
