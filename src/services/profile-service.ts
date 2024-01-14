import { Logger } from "@/common/libs/logger";
import { IMentorRepository, IParticipantRepository, IUserRepository } from "@/domain/service";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";
import { EROLES } from "@/common/utils/roles";
import { IMentor, IMentorCreate, Mentor } from "@/domain/model/mentor";
import { Auth, IAuth, IParticipantCreate, Participant, User } from "@/domain/model";

@injectable()
export class ProfileService {
  private auth: Auth;
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.MentorRepository) private mentorRepository: IMentorRepository,
    @inject(TYPES.ParticipantRepository) private participantRepository: IParticipantRepository
  ) {}
  async getProfile() {
    if (!this.auth) return null;
    if (this.auth.user.roles.includes(EROLES.MENTOR)) {
      const mentor = await this.mentorRepository.findByUserId(this.auth.user.id);
      return mentor;
    } else if (this.auth.user.roles.includes(EROLES.PARTICIPANT)) {
      const participant = await this.participantRepository.findByUserId(this.auth.user.id);
      return participant;
    }
  }
  async updateProfile(data: IMentorCreate | IParticipantCreate) {
    if (!this.auth) return null;
    if (this.auth.user.roles.includes(EROLES.MENTOR)) {
      const mentor = await this.mentorRepository.findByUserId(this.auth.user.id);
      const user = User.create(await this.userRepository.findById(mentor.userId));
      if (mentor) {
        const mentorEntity = Mentor.create({
          ...(<IMentorCreate>mentor),
          ...{
            username: (<IMentor>data).username,
            fullname: (<IMentor>data).fullname,
            avatarUrl: (<IMentor>data).avatarUrl,
            className: (<IMentor>data).className,
            bankInfo: {
              accountName: (<IMentor>data).bankInfo.accountName,
              accountNo: (<IMentor>data).bankInfo.accountNo,
              name: (<IMentor>data).bankInfo.name,
            },
            introVideo: {
              service: (<IMentor>data).introVideo.service,
              url: (<IMentor>data).introVideo.url,
            },
            availableClasses: (<IMentor>data).availableClasses,
            isOnline: (<IMentor>data).isOnline,
            price: (<IMentor>data).price,
            certificates: (<IMentor>data).certificates,
            schedules: (<IMentor>data).schedules,
            nickname: (<IMentor>data).nickname,
            bio: (<IMentor>data).bio,
            gender: (<IMentor>data).gender,
            lastEducation: (<IMentor>data).lastEducation,
            company: {
              name: (<IMentor>data).company.name,
              jobRole: (<IMentor>data).company.jobRole,
              jobLevel: (<IMentor>data).company.jobLevel,
            },
            providerFee: (<IMentor>data).providerFee,
            mentorFee: (<IMentor>data).mentorFee,
            feeAcceptedAt: (<IMentor>data).feeAcceptedAt,
          },
        });
        user.fullname = mentor.fullname;
        const mentorDto = mentorEntity.unmarshall();
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
  public setAuth(auth: IAuth) {
    this.auth = Auth.create(auth);
  }
}
