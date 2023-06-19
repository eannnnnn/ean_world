import { Injectable } from '@nestjs/common';
import DrizzleService from '../database/drizzle.service';

@Injectable()
export default class FeedService {
  constructor(private readonly drizzle: DrizzleService) {}
}
