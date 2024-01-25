import { Logger } from "@/common/libs/logger";
import { IBookRepository, IMentorRepository, IParticipantRepository, IUserRepository } from "@/domain/service";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";
import { EROLES } from "@/common/utils/roles";
import { IMentor, IMentorCreate, Mentor } from "@/domain/model/mentor";
import { Auth, IAuth, IParticipant, IParticipantCreate, Participant, User } from "@/domain/model";
import fs from "fs";
import axios from "axios";
import { request } from "https";
import { EBookStatus } from "@/common/utils/book-status";

@injectable()
export class ProfileService {
  private auth: Auth;
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.MentorRepository) private mentorRepository: IMentorRepository,
    @inject(TYPES.ParticipantRepository) private participantRepository: IParticipantRepository,
    @inject(TYPES.BookRepository) private bookRepository: IBookRepository
  ) {}
  async getProfile() {
    if (!this.auth) return null;
    if (this.auth.user.roles.includes(EROLES.MENTOR)) {
      const mentor = await this.mentorRepository.findByUserId(this.auth.user.id);
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
      return mentor;
    } else if (this.auth.user.roles.includes(EROLES.PARTICIPANT)) {
      const participant = await this.participantRepository.findByUserId(this.auth.user.id);
      return participant;
    }
  }
  async updateProfile(data: IMentorCreate | IParticipantCreate, reqMentor: Boolean) {
    if (!this.auth) return null;
    if (this.auth.user.roles.includes(EROLES.MENTOR) || reqMentor) {
      let mentorDto = await this.mentorRepository.findByUserId(this.auth.user.id);
      const user = User.create(
        await this.userRepository.findById(mentorDto?.userId || this.auth.userId)
      );
      if (!mentorDto) {
        mentorDto = Mentor.create({
          userId: user.id,
          username: user.email,
          fullname: user.fullname,
          avatarUrl: "",
          className: [],
          bankInfo: {
            accountName: user.fullname,
            accountNo: "",
            name: "",
          },
          introVideo: {
            service: "",
            url: "",
          },
          availableClasses: [],
          upcomingClasses: [],
          highlightedUpcomingClass: {
            type: "",
            className: "",
            thumbnailUrl: "",
          },
          liveClasses: [],
          isOnline: false,
          reviewPoint: 0,
          price: 0,
          isCertified: false,
          joinedAt: 0,
          certificates: [],
          rating: 0,
          schedules: [],
          nickname: "",
          bio: "",
          gender: "",
          lastEducation: "",
          company: {
            name: "",
            jobRole: "",
            jobLevel: "",
          },
          providerFee: 0,
          mentorFee: 0,
          feeAcceptedAt: 0,
        }).unmarshall();
      }
      if (mentorDto) {
        const mentorEntity = Mentor.create({
          ...mentorDto,
          ...{
            username: (<IMentor>data).username || "",
            fullname: (<IMentor>data).fullname || "",
            avatarUrl: (<IMentor>data).avatarUrl || "",
            className: (<IMentor>data).className || [],
            bankInfo: {
              accountName: (<IMentor>data)?.bankInfo?.accountName || "",
              accountNo: (<IMentor>data)?.bankInfo?.accountNo || "",
              name: (<IMentor>data)?.bankInfo?.name || "",
            },
            introVideo: {
              service: (<IMentor>data)?.introVideo?.service || "",
              url: (<IMentor>data)?.introVideo?.url || "",
            },
            availableClasses: (<IMentor>data).availableClasses || [],
            isOnline: (<IMentor>data).isOnline || true,
            price: (<IMentor>data).price || 100000,
            certificates: (<IMentor>data).certificates || [],
            schedules: (<IMentor>data).schedules || [],
            nickname: (<IMentor>data).nickname || "",
            bio: (<IMentor>data).bio || "",
            gender: (<IMentor>data).gender || "",
            lastEducation: (<IMentor>data).lastEducation || "",
            company: {
              name: (<IMentor>data)?.company?.name || "",
              jobRole: (<IMentor>data)?.company?.jobRole || "",
              jobLevel: (<IMentor>data)?.company?.jobLevel || "",
            },
            providerFee: (<IMentor>data)?.providerFee || 50,
            mentorFee: (<IMentor>data)?.mentorFee || 50,
            feeAcceptedAt: (<IMentor>data)?.feeAcceptedAt || null,
          },
        });
        user.fullname = mentorDto.fullname;
        mentorDto = mentorEntity.unmarshall();
        const userDto = user.unmarshall();
        const [mentorUpdate, userUpdateDto] = await Promise.all([
          this.mentorRepository.save(mentorDto),
          this.userRepository.save(userDto),
        ]);
        return mentorUpdate;
      }
    } else if (this.auth.user.roles.includes(EROLES.PARTICIPANT)) {
      const participant = await this.participantRepository.findByUserId(this.auth.user.id);
      if (participant) {
        const participantEntity = Participant.create({
          ...(<IParticipantCreate>participant),
          ...{
            username: (<IParticipantCreate>data).username,
            fullname: (<IParticipantCreate>data).fullname,
            bio: (<IParticipantCreate>data).bio,
            gender: (<IParticipantCreate>data).gender,
            avatarUrl: (<IParticipantCreate>data).avatarUrl,
            introVideo: {
              service: (<IParticipantCreate>data)?.introVideo?.service || "",
              url: (<IParticipantCreate>data)?.introVideo?.url || "",
            },
            hasUnreadNotif: (<IParticipantCreate>data).hasUnreadNotif,
          },
        });
        const user = User.create(await this.userRepository.findById(participant.userId));
        user.fullname = participant.fullname;
        const userDto = user.unmarshall();
        const participantDto = participantEntity.unmarshall();
        const [participantUpdate, userUpdate] = await Promise.all([
          this.participantRepository.save(participantDto),
          this.userRepository.save(userDto),
        ]);
        return participantUpdate;
      }
    }
  }
  public async getAvatarFile(email: string) {
    const userDto = await this.userRepository.findByUsernameOrEmail(email);
    let profileDto: IMentor | IParticipant = await this.participantRepository.findByUserId(
      userDto.id
    );
    if (!profileDto) {
      profileDto = await this.mentorRepository.findByUserId(userDto.id);
    }
    const response = await axios.get(
      profileDto?.avatarUrl ||
        `https://dummyimage.com/100x100&text=${profileDto.fullname.substring(0, 1)}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }
  public setAuth(auth: IAuth) {
    this.auth = Auth.create(auth);
  }
}
