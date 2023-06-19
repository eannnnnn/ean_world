import { Injectable } from '@nestjs/common';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { account } from 'drizzle/schema';
import DrizzleService from '../database/drizzle.service';
import { feed, feedReply } from '../database/schemas/schema';
import { CreateFeedDTO } from './dtos/create-feed.dto';
import GetFeedsDTO from './dtos/get-feeds.dto';

@Injectable()
export default class FeedService {
  constructor(private readonly drizzle: DrizzleService) {}

  /** 게시물 총 갯수 */
  async getFeedCount(query: GetFeedsDTO) {
    const [{ count }] = await this.drizzle
      .select({
        count: sql<string>`count(${feed.id})`,
      })
      .from(feed)
      .innerJoin(
        account,
        and(
          eq(feed.userId, account.id),
          query.userUuid && eq(account.uuid, query.userUuid),
        ),
      );

    return parseInt(count);
  }

  /** 게시물 목록 불러오기 */
  async getFeeds(query: GetFeedsDTO) {
    return await this.drizzle
      .select({
        id: feed.id,
        uuid: feed.uuid,
        accountUuid: account.uuid,
        contents: feed.contents,
        createdAt: feed.createdAt,
        updatedAt: feed.updatedAt,
        replies: sql<string[]>`
        case
          when count(${feedReply.id}) = 0 then '[]'
        else
          json_agg(json_build_object(
            'replyId', ${feedReply.id},
            'contents', ${feedReply.contents},
            'createdAt', ${feedReply.createdAt},
            'updatedAt', ${feedReply.updatedAt}
          ))
        end`,
      })
      .from(feed)
      .innerJoin(
        account,
        and(
          eq(feed.userId, account.id),
          query.userUuid && eq(account.uuid, query.userUuid),
        ),
      )
      .leftJoin(
        feedReply,
        inArray(
          feedReply.feedId,
          sql`(
            ${this.drizzle
              .select({ replyId: feedReply.id })
              .from(feedReply)
              .where(eq(feedReply.feedId, feed.id))
              .orderBy(desc(feedReply.id))
              .offset(0)
              .limit(3)
              .getSQL()}
          )`,
        ),
      )
      .offset((query.page - 1) * 10)
      .limit(query.limit)
      .groupBy(feed.id, account.id)
      .orderBy(desc(feed.id));
  }

  /** 게시물 등록 */
  async createFeed(data: CreateFeedDTO) {
    await this.drizzle.insert(feed).values({
      userId: data.userId,
      contents: data.contents,
    });
  }
}
