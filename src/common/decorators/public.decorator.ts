import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const CACHE_BY_USER = 'CACHE_BY_USER';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
