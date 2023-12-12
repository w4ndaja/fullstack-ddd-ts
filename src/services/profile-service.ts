import { Logger } from "@/common/libs/logger";
import { IMentorRepository, IParticipantRepository, IUserRepository } from "@/domain/service";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";
import { AuthService } from "./auth-service";
import { EROLES } from "@/common/utils/roles";
import { IMentor, IMentorCreate, Mentor } from "@/domain/model/mentor";
import { IParticipantCreate, Participant } from "@/domain/model";

@injectable()
export class ProfileService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.MentorRepository) private mentorRepository: IMentorRepository,
    @inject(TYPES.ParticipantRepository) private participantRepository: IParticipantRepository,
    @inject(AuthService) private authService: AuthService
  ) {}
  async getProfile() {
    const auth = this.authService.auth;
    if (!auth) return null;
    if (auth.user.roles.includes(EROLES.MENTOR)) {
      const mentor = await this.mentorRepository.findByUserId(auth.user.id);
      return mentor;
    } else if (auth.user.roles.includes(EROLES.PARTICIPANT)) {
      const participant = await this.participantRepository.findByUserId(auth.user.id);
      return participant;
    }
  }
  async updateProfile(data: IMentorCreate | IParticipantCreate) {
    const auth = this.authService.auth;
    if (!auth) return null;
    if (auth.user.roles.includes(EROLES.MENTOR)) {
      const mentor = await this.mentorRepository.findByUserId(auth.user.id);
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
            company: {
              name: (<IMentor>data).company.name,
            },
            graduateFrom: {
              name: (<IMentor>data).graduateFrom.name,
              region: (<IMentor>data).graduateFrom.region,
            },
            introVideo: {
              service: (<IMentor>data).introVideo.service,
              url: (<IMentor>data).introVideo.url,
            },
            availableClasses: (<IMentor>data).availableClasses,
            isOnline: (<IMentor>data).isOnline,
            price: (<IMentor>data).price,
          },
        });
        const mentorDto = mentorEntity.unmarshall();
        const mentorUpdate = await this.mentorRepository.save(mentorDto);
        return mentorUpdate;
      }
    } else if (auth.user.roles.includes(EROLES.PARTICIPANT)) {
      const participant = await this.participantRepository.findByUserId(auth.user.id);
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
        const participantDto = participantEntity.unmarshall();
        const participantUpdate = await this.participantRepository.save(participantDto);
        return participantUpdate;
      }
    }
  }
}
