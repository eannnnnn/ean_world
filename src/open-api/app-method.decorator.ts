import { Delete, Get, Patch, Post, Put, applyDecorators } from '@nestjs/common';
import { ApiSummary } from './api-summary.decorator';

/** Get 요청 및 summary */
export const AppGet = (path: string, summary = '') =>
  applyDecorators(Get(path), ApiSummary(summary));
/** POST 요청 및 summary */
export const AppPost = (path: string, summary = '') =>
  applyDecorators(Post(path), ApiSummary(summary));
/** PUT 요청 및 summary */
export const AppPut = (path: string, summary = '') =>
  applyDecorators(Put(path), ApiSummary(summary));
/** PATCH 요청 및 summary */
export const AppPatch = (path: string, summary = '') =>
  applyDecorators(Patch(path), ApiSummary(summary));
/** DELETE 요청 및 summary */
export const AppDelete = (path: string, summary = '') =>
  applyDecorators(Delete(path), ApiSummary(summary));
