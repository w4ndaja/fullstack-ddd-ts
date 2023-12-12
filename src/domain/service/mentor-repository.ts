import { IClassCategory } from "../model/class-category";
import { IMentor } from "../model/mentor";
import { IRepository } from "./repository";

export type IMentorSortType = "rating" | "price" | "certified";
export interface IMentorRepository extends IRepository<IMentor> {
  findByUserId(userId: string): Promise<IMentor | null>;
  getMentors(): Promise<IMentor[]>;
  getMentorsSorted(sortType: IMentorSortType): Promise<IMentor[]>;
  getAllMentors(
    search: string,
    category: IClassCategory["id"],
    limit: number,
    offset: number
  ): Promise<IMentor[]>;
}
