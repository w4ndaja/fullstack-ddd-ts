import { IClassCategory } from "../model/class-category";
import { IMentor } from "../model/mentor";

export type IMentorSortType = "rating" | "price" | "certified";
export interface IMentorRepository {
  getMentors(): Promise<IMentor[]>;
  getMentorsSorted(sortType: IMentorSortType): Promise<IMentor[]>;
  getAllMentors(
    search: string,
    category: IClassCategory["id"],
    limit: number,
    offset: number
  ): Promise<IMentor[]>;
}
