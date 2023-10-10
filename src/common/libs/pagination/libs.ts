export class PaginationLib {
  public static calcSkip(page: number, limit: number): number {
    return page < 2 ? 0 : (page - 1) * limit;
  }
}
