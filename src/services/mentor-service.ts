import { AppError } from "@/common/libs/error-handler";
import { ErrorCode } from "@/common/utils";
import { EBookStatus } from "@/common/utils/book-status";
import { EROLES } from "@/common/utils/roles";
import { User } from "@/domain/model";
import { Mentor } from "@/domain/model/mentor";
import {
  IBookRepository,
  IMentorRepository,
  IMentorSortType,
  IUserRepository,
} from "@/domain/service";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";

@injectable()
export class MentorService {
  constructor(
    @inject(TYPES.MentorRepository) private mentorRepository: IMentorRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.BookRepository) private bookRepository: IBookRepository
  ) {}
  async getMentors() {
    let mentorDto = await this.mentorRepository.getMentors();
    const mentors = mentorDto.map((item) => Mentor.create(item));
    await Promise.all(
      mentors.map(async (mentor) => {
        mentor.reviews = (
          await this.bookRepository.findAllByMentorId(
            mentor.userId,
            EBookStatus.FINISHED.toString()
          )
        ).map((review) => ({
          avatarUrl: review.participantAvatar,
          rating: review.rating,
          review: review.review,
        }));
        mentor.rating =
          (Math.ceil(mentor.reviews.reduce((a, b) => a + b.rating, 0) / mentor.reviews.length) *
            2) /
          2;
      })
    );
    mentorDto = mentors.map((item) => item.unmarshall());
    return mentorDto;
  }
  async getMentorsSorted(sortType: IMentorSortType) {
    let mentor = await this.mentorRepository.getMentorsSorted(sortType);
    const mentors = mentor.map((item) => Mentor.create(item));
    await Promise.all(
      mentors.map(async (mentor) => {
        mentor.reviews = (
          await this.bookRepository.findAllByMentorId(
            mentor.userId,
            EBookStatus.FINISHED.toString()
          )
        ).map((review) => ({
          avatarUrl: review.participantAvatar,
          rating: review.rating,
          review: review.review,
        }));
        mentor.rating =
          (Math.ceil(mentor.reviews.reduce((a, b) => a + b.rating, 0) / mentor.reviews.length) *
            2) /
          2;
      })
    );
    mentor = mentors.map((item) => item.unmarshall());
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
    let mentor = await this.mentorRepository.getAllMentors(
      search,
      category,
      sortBy,
      limit,
      offset,
      verified
    );
    const mentors = mentor.map((item) => Mentor.create(item));
    await Promise.all(
      mentors.map(async (mentor) => {
        mentor.reviews = (
          await this.bookRepository.findAllByMentorId(
            mentor.userId,
            EBookStatus.FINISHED.toString()
          )
        ).map((review) => ({
          avatarUrl: review.participantAvatar,
          rating: review.rating,
          review: review.review,
        }));
        mentor.rating =
          (Math.ceil(mentor.reviews.reduce((a, b) => a + b.rating, 0) / mentor.reviews.length) *
            2) /
          2;
      })
    );
    mentor = mentors.map((item) => item.unmarshall());
    return mentor;
  }
  async getDetailMentor(id: string) {
    const mentor = await this.mentorRepository.findById(id);
    const [userMentorDto, booksDto] = await Promise.all([
      this.userRepository.findById(mentor.userId),
      this.bookRepository.findAllByMentorId(mentor.userId, ""),
    ]);
    mentor.email = userMentorDto.email;
    mentor.reviews = booksDto.map((book) => ({
      avatarUrl: book.participantAvatar,
      rating: book.rating,
      review: book.review,
    }));
    mentor.rating =
      (Math.ceil(mentor.reviews.reduce((a, b) => a + b.rating, 0) / mentor.reviews.length) * 2) / 2;
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
