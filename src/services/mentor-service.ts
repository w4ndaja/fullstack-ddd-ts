import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils";
import { EROLES } from "@/common/utils/roles";
import { User } from "@/domain/model";
import { Mentor } from "@/domain/model/mentor";
import { IMentorRepository, IMentorSortType, IUserRepository } from "@/domain/service";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";

@injectable()
export class MentorService {
  constructor(
    @inject(TYPES.MentorRepository) private mentorRepository: IMentorRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}
  async getMentors() {
    const mentor = await this.mentorRepository.getMentors();
    return mentor;
  }
  async getMentorsSorted(sortType: IMentorSortType) {
    const mentor = await this.mentorRepository.getMentorsSorted(sortType);
    return mentor;
  }
  async getAllMentors(
    search: string,
    category: string,
    sortBy: IMentorSortType,
    limit: number,
    offset: number,
    verified: boolean
  ) {
    const mentor = await this.mentorRepository.getAllMentors(
      search,
      category,
      sortBy,
      limit,
      offset,
      verified
    );
    return mentor;
  }
  async getDetailMentor(id: string) {
    const mentor = await this.mentorRepository.findById(id);
    const userMentorDto = await this.userRepository.findById(mentor.userId);
    mentor.email = userMentorDto.email;
    return mentor;
  }
  async approveMentor(mentorId: string) {
    let mentorDto = await this.mentorRepository.findById(mentorId);
    if (!mentorDto) {
      throw new AppError(ErrorCode.NOT_FOUND, "Mentor Not Found!");
    }
    let userDto = await this.userRepository.findById(mentorDto.userId);
    const user = User.create(userDto);
    const mentor = Mentor.create(mentorDto);
    mentor.approve();
    user.setRole(EROLES.MENTOR);
    mentorDto = mentor.unmarshall();
    userDto = user.unmarshall();
    [mentorDto, userDto] = await Promise.all([
      this.mentorRepository.save(mentorDto),
      this.userRepository.save(userDto),
    ]);
    mentorDto = Mentor.create(mentorDto).unmarshall();
    userDto = User.create(userDto).unmarshall();
    return mentorDto;
  }
}
