import { Injectable } from '@nestjs/common';

export const DEFAULT_PER_PAGE = 10;

@Injectable()
export class PaginationService {
  getPagination(page = 0, limit = DEFAULT_PER_PAGE, totalCount: number) {
    const totalPages = Math.ceil(totalCount / limit);

    return {
      skip: page * limit,
      limit,
      meta: {
        totalPages: totalPages,
        page: page + 1,
        limit,
        count: totalCount,
      },
    };
  }
}
