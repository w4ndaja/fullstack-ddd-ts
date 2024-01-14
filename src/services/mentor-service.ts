import { IMentorRepository, IMentorSortType } from "@/domain/service";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";

@injectable()
export class MentorService {
  constructor(@inject(TYPES.MentorRepository) private mentorRepository: IMentorRepository) {}
  async getMentors() {
    const mentor = await this.mentorRepository.getMentors();
    return mentor;
  }
  async getMentorsSorted(sortType: IMentorSortType) {
    const mentor = await this.mentorRepository.getMentorsSorted(sortType);
    return mentor;
  }
  async getAllMentors(search: string, category: string, sortBy:IMentorSortType, limit: number, offset: number) {
    const mentor = await this.mentorRepository.getAllMentors(search, category, sortBy, limit, offset);
    return mentor;
  }
  async getDetailMentor(id: string) {
    const mentor = await this.mentorRepository.findById(id);
    return mentor;
  }
}
