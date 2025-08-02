import { CACHE_KEY_METADATA, CACHE_TTL_METADATA } from '@nestjs/cache-manager';
import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { CACHE_BY_USER } from './public.decorator';
import { HttpCacheInterceptor } from '../interceptors/http-cache.interceptor';
interface ConfigCache {
  cacheKey: string | undefined;
  cacheTTL: number | undefined;
  cacheForEachUser: boolean | undefined;
}

export function CacheDecorator(config: ConfigCache): MethodDecorator {
  return applyDecorators(
    UseInterceptors(HttpCacheInterceptor),
    SetMetadata(CACHE_KEY_METADATA, config.cacheKey),
    SetMetadata(CACHE_TTL_METADATA, config.cacheTTL),
    SetMetadata(CACHE_BY_USER, config.cacheForEachUser),
  );
}
