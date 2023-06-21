import { Injectable } from '@nestjs/common';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import BadRequestException from 'src/errors/bad-request.exception';
import { ErrorCode } from 'src/errors/error.const';
import DrizzleService from '../database/drizzle.service';
import {
  account,
  feed,
  feedFiles,
  feedReply,
  file,
} from '../database/schemas/schema';
import { CreateFeedDTO } from './dtos/create-feed.dto';
import GetFeedsDTO from './dtos/get-feeds.dto';
import { UpdateFeedDTO } from './dtos/update-feed.dto';

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
        replies: sql<
          {
            replyId: number;
            contents: string;
            createdAt: string;
            updatedAt: string;
          }[]
        >`
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
        files: sql<string[]>`
        case
          when count(${file.id}) = 0 then '[]'
        else
          json_agg(${file.uuid})
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
      .leftJoin(feedFiles, eq(feedFiles.feedId, feed.id))
      .leftJoin(file, eq(file.id, feedFiles.fileId))
      .offset((query.page - 1) * 10)
      .limit(query.limit)
      .groupBy(feed.id, account.id)
      .orderBy(desc(feed.id));
  }

  /** 게시물 등록 */
  async createFeed(data: CreateFeedDTO) {
    return await this.drizzle.transaction(async (trx) => {
      const [{ feedId, uuid }] = await trx
        .insert(feed)
        .values({
          userId: data.userId,
          contents: data.contents,
        })
        .returning({
          feedId: feed.id,
          uuid: feed.uuid,
        });
      await Promise.all(
        data.files.map(async (fileId) => {
          await trx.insert(feedFiles).values({
            feedId,
            fileId,
          });
        }),
      );

      return uuid;
    });
  }

  /** 게시물 수정 */
  async updateFeed(uuid: string, data: UpdateFeedDTO) {
    const [targetFeed] = await this.drizzle
      .select()
      .from(feed)
      .where(eq(feed.uuid, uuid));

    if (!targetFeed) throw new BadRequestException(ErrorCode.NOT_FOUND);

    if (targetFeed.userId !== data.userId)
      throw new BadRequestException(ErrorCode.FORBIDDEN);

    await this.drizzle.transaction(async (trx) => {
      const [{ feedId }] = await trx
        .update(feed)
        .set({
          contents: data.contents,
        })
        .where(and(eq(feed.uuid, uuid), eq(feed.userId, data.userId)))
        .returning({
          feedId: feed.id,
        });

      await trx.delete(feedFiles).where(eq(feedFiles.feedId, feedId));

      await Promise.all(
        data.files.map(async (fileId) => {
          await trx.insert(feedFiles).values({
            feedId,
            fileId,
          });
        }),
      );
      return uuid;
    });
  }

  /** 게시물 삭제 */
  async deleteFeed(uuid: string, userId: number) {
    const [targetFeed] = await this.drizzle
      .select()
      .from(feed)
      .where(eq(feed.uuid, uuid));

    if (!targetFeed) throw new BadRequestException(ErrorCode.NOT_FOUND);

    if (targetFeed.userId !== userId)
      throw new BadRequestException(ErrorCode.FORBIDDEN);

    await this.drizzle.transaction(async (trx) => {
      await trx.delete(feedFiles).where(eq(feedFiles.feedId, targetFeed.id));
      await trx.delete(feedReply).where(eq(feedReply.feedId, targetFeed.id));
      await trx.delete(feed).where(eq(feed.id, targetFeed.id));
    });
    return true;
  }
}
