import { AppError } from "@/common/libs/error-handler";
import { Logger } from "@/common/libs/logger";
import { GenericPaginatedData, IBaseGetParam } from "@/common/libs/pagination";
import { ErrorCode } from "@/common/utils";
import { EROLES } from "@/common/utils/roles";
import { Auth, User } from "@/domain/model";
import { ILiveTraining, ILiveTrainingStatus, LiveTraining } from "@/domain/model/live-training";
import {
  ILiveTrainingParticipants,
  LiveTrainingBook,
  LiveTraniningBookPayment,
} from "@/domain/model/live-training-book";
import { Mentor } from "@/domain/model/mentor";
import {
  ILiveTrainingBookRepository,
  ILiveTrainingRepository,
  IMentorRepository,
  IParticipantRepository,
  IUserRepository,
} from "@/domain/service";
import { TYPES } from "@/ioc/types";
import { inject, injectable } from "inversify";

@injectable()
export class LiveTrainingService {
  private auth: Auth;
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.LiveTrainingRepository) private liveTrainingRepository: ILiveTrainingRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.LiveTrainingBookRepository)
    private liveTrainingBookRepository: ILiveTrainingBookRepository,
    @inject(TYPES.MentorRepository) private mentorRepository: IMentorRepository,
    @inject(TYPES.ParticipantRepository) private participantRepository: IParticipantRepository
  ) {}
  public async create(
    title: string,
    startAt: number,
    maxAudiens: number,
    thumbnailUrl: string,
    context: string,
    contextFilesUrl: string[],
    price: number,
    mentorFee: number,
    providerFee: number
  ) {
    const mentor = Mentor.create(await this.mentorRepository.findByUserId(this.auth.userId));
    const ongoingLiveTraining = await this.liveTrainingRepository.findActiveByMentorId(mentor.id);
    if (ongoingLiveTraining) {
      throw new AppError(
        ErrorCode.UNPROCESSABLE_ENTITY,
        "Status anda sedang Live Training. Selesaikan Live Training dan bergabung kembali"
      );
    }
    const liveTraining = LiveTraining.create({
      title: title,
      thumbnailUrl: thumbnailUrl,
      mentorId: mentor.id,
      fullname: mentor.fullname,
      avatarUrl: mentor.avatarUrl,
      graduatedFrom: mentor.company.name,
      startAt: startAt,
      maxAudiens: maxAudiens,
      context: context,
      contextFilesUrl: contextFilesUrl,
      price: price,
      mentorFee: mentorFee,
      providerFee: providerFee,
    });
    let liveTrainingDto = liveTraining.unmarshall();
    this.liveTrainingRepository.save(liveTrainingDto);
    return liveTrainingDto;
  }

  public async authorize(trainingId: string): Promise<ILiveTraining> {
    const liveTraining = LiveTraining.create(
      await this.liveTrainingRepository.findById(trainingId)
    );
    liveTraining.authorize();
    const liveTrainingDto = liveTraining.unmarshall();
    this.liveTrainingRepository.save(liveTrainingDto);
    return liveTrainingDto;
  }

  public async book(
    liveTrainingId: string,
    _participants: ILiveTrainingParticipants[],
    payment: Partial<LiveTraniningBookPayment>
  ) {
    let liveTrainingDto = await this.liveTrainingRepository.findById(liveTrainingId);
    const liveTraining = LiveTraining.create(liveTrainingDto);
    if (!liveTraining.authorized) {
      throw new AppError(ErrorCode.FORBIDDEN, "Live Training tidak dapat diakses!");
    }
    let participants = [..._participants];
    participants.push({
      userId: this.auth.userId,
      fullname: this.auth.user.fullname,
      email: this.auth.user.email,
      phone: "",
      instance: "",
      isNew: false,
    });
    participants = participants.reverse();
    if (liveTraining.audiensCount + participants.length > liveTraining.maxAudiens) {
      throw new AppError(ErrorCode.FORBIDDEN, "Live Training sudah penuh!");
    }
    const mentor = Mentor.create(await this.mentorRepository.findById(liveTraining.mentorId));
    const liveTrainingBook = LiveTrainingBook.create({
      liveTrainingId: liveTraining.id,
      userId: this.auth.user.id,
      participants: participants,
      mentorName: mentor.fullname,
      userName: this.auth.user.fullname,
      title: liveTraining.title,
      startAt: liveTraining.startAt.getTime(),
      payment: <LiveTraniningBookPayment>payment,
    });
    liveTrainingBook.payment.subTotal = liveTraining.price * participants.length;
    liveTrainingBook.payment.total =
      liveTrainingBook.payment.subTotal +
      liveTrainingBook.payment.adminFee +
      liveTrainingBook.payment.tax;
    const userParticipants: User[] = await Promise.all(
      participants.map((participant) =>
        (async () => {
          return User.create(await this.userRepository.findByUsernameOrEmail(participant.email));
        })()
      )
    );
    await Promise.all(
      userParticipants.map((user) => {
        return (async () => {
          if (user.hasRole(EROLES.MENTOR)) {
            const mentor = await this.mentorRepository.findByUserId(user.id);
            liveTraining.audiensCount++;
            liveTraining.audiensAvatar.push(mentor.avatarUrl);
          } else if (user.hasRole(EROLES.PARTICIPANT)) {
            const participant = await this.participantRepository.findByUserId(user.id);
            liveTraining.audiensCount++;
            liveTraining.audiensAvatar.push(participant.avatarUrl);
          }
        })();
      })
    );
    const liveTrainingParticipantDto = liveTrainingBook.unmarshall();
    liveTrainingDto = liveTraining.unmarshall();
    await Promise.all([
      this.liveTrainingRepository.save(liveTrainingDto),
      this.liveTrainingBookRepository.save(liveTrainingParticipantDto),
    ]);
    return liveTrainingParticipantDto;
  }

  public async getAllByStatus(param: IBaseGetParam, status: ILiveTrainingStatus) {
    let liveTrainingsDto = await this.liveTrainingRepository.findAllByStatus(param, status);
    const liveTrainings = GenericPaginatedData.create<LiveTraining, ILiveTraining>({
      ...liveTrainingsDto,
      data: liveTrainingsDto.data.map((item) => LiveTraining.create(item).unmarshall()),
    });
    liveTrainingsDto = liveTrainings.unmarshall();
    return liveTrainingsDto;
  }

  public async setPaid(liveTrainingId: string) {
    const liveTrainingBook = LiveTrainingBook.create(
      await this.liveTrainingBookRepository.findById(liveTrainingId)
    );
    liveTrainingBook.setPaid();
    let liveTrainingBookDto = liveTrainingBook.unmarshall();
    liveTrainingBookDto = await this.liveTrainingBookRepository.save(liveTrainingBookDto);
    return liveTrainingBookDto;
  }

  public async join(liveTrainingId: string) {
    let liveTrainingBookDto = await this.liveTrainingBookRepository.findByIdAndParticipantId(
      liveTrainingId,
      this.auth.userId
    );
    if (!liveTrainingBookDto) {
      throw new AppError(
        ErrorCode.FORBIDDEN,
        "Layanan ini belum dibayar, silahkan selesaikan pembayaran untuk melanjutkan!"
      );
    }
    const liveTraining = LiveTraining.create(
      await this.liveTrainingRepository.findById(liveTrainingId)
    );
    const liveTrainingDto = liveTraining.unmarshall();
    return liveTrainingDto;
  }

  public async findActiveByRoomIdAndMentorId(roomId: string, mentorId: string) {
    const liveTrainingDto = await this.liveTrainingRepository.findActiveByRoomAndMentorId(
      roomId,
      mentorId
    );
    if (!liveTrainingDto) {
      throw new AppError(ErrorCode.NOT_FOUND, "Tidak ada live yang tersedia!");
    }
    return liveTrainingDto;
  }

  public async finish(liveTrainingId: string) {
    const liveTraining = LiveTraining.create(
      await this.liveTrainingRepository.findById(liveTrainingId)
    );
    liveTraining.finish();
    const liveTrainingDto = liveTraining.unmarshall();
    await this.liveTrainingRepository.save(liveTrainingDto);
    return liveTrainingDto;
  }

  public async findHistories(
    param: IBaseGetParam,
    startDate: number,
    endDate: number,
    status: string
  ) {
    const mentor = Mentor.create(await this.mentorRepository.findByUserId(this.auth.userId));
    const liveTraining = GenericPaginatedData.create(
      await this.liveTrainingRepository.findHistoryByMonthStatusAndMentorId(
        startDate,
        endDate,
        mentor.id,
        param.page,
        param.limit,
        status
      )
    );
    return liveTraining.unmarshall();
  }

  public async findUserHistories(
    param: IBaseGetParam,
    startDate: number,
    endDate: number,
    status: string
  ) {
    const liveTraining = GenericPaginatedData.create(
      await this.liveTrainingBookRepository.findHistoryByMonthStatusAndUserId(
        startDate,
        endDate,
        this.auth.userId,
        param.page,
        param.limit,
        status
      )
    );
    const liveTrainingDto = liveTraining.unmarshall();
    return liveTrainingDto;
  }

  public setAuth(auth: Auth): void {
    this.auth = auth;
  }
}
