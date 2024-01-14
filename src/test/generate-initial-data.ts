import "reflect-metadata";
import { EROLES } from "@/common/utils/roles";
import { IUser, Participant, User } from "@/domain/model";
import { container } from "@/ioc/container";
import { AuthService, BookService, UserService } from "@/services";
import { EGENDERS } from "@/common/utils/genders";
import { IMentorRepository, IParticipantRepository } from "@/domain/service";
import { MentorRepository, ParticipantRepository } from "@/infra/mongodb";
import { IMentor, IMentorCreate, Mentor } from "@/domain/model/mentor";
import { TYPES } from "@/ioc/types";

const userSuperAdmin = User.create({
  email: "super@admin.com",
  roles: [EROLES.SUPER_ADMIN],
});
userSuperAdmin.password = "password";

const userAdmin = User.create({
  email: "admin@admin.com",
  roles: [EROLES.ADMIN],
});
userAdmin.password = "password";

const participant1 = User.create({
  fullname: "participant1",
  email: "participant1@admin.com",
  roles: [EROLES.PARTICIPANT],
});
participant1.password = "password";

const participant2 = User.create({
  fullname: "participant2",
  email: "participant2@admin.com",
  roles: [EROLES.PARTICIPANT],
});
participant2.password = "password";

const userOrganization = User.create({
  email: "organization@admin.com",
  roles: [EROLES.ORGANISATION],
});
userOrganization.password = "password";

const participantProfile1 = Participant.create({
  username: "participant1",
  fullname: "Dummy Participant 001",
  bio: "I'm dummy participant",
  gender: EGENDERS.FEMALE.toString(),
  userId: participant1.id,
  introVideo: {
    service: "youtube",
    url: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
  },
});
const participantProfile2 = Participant.create({
  username: "participant2",
  fullname: "Dummy Participant 002",
  bio: "I'm dummy participant",
  gender: EGENDERS.MALE.toString(),
  userId: participant2.id,
  introVideo: {
    service: "youtube",
    url: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
  },
});
const dummyMentorProfiles: IMentor[] = [];
const dummyMentorUsers: IUser[] = [];

// Generate array of dummy avatar file names
let avatarsImage: string[] = [];
for (let i = 1; i <= 20; i++) {
  avatarsImage.push(`Avatar${i}.png`);
}

// Generate 200 of dummy mentors
for (let i = 0; i < 200; i++) {
  const randImage = avatarsImage[Math.ceil(Math.random() * 20)];
  const mentor = User.create({
    email: `mentor${i + 1}@admin.com`,
    roles: [EROLES.MENTOR],
  });
  mentor.password = "password";
  const mentorProfile = Mentor.create({
    userId: mentor.id,
    username: `dummyUsername${i + 1}`,
    fullname: `Dummy User ${i + 1}`,
    avatarUrl: `https://camy-dev.pentarex.id/storage/${randImage}`,
    className: ["Class A", "Class B"],
    bankInfo: {
      accountName: "Dummy Account",
      accountNo: "1234567890",
      name: "Dummy Bank",
    },
    introVideo: {
      service: "YouTube",
      url: "https://youtu.be/aW849GKgFSE?si=Gj1E1JscM6S9uXdn",
    },
    availableClasses: ["Class C", "Class D"],
    upcomingClasses: [
      {
        type: "Class E",
        classDate: Date.now() + 86400000,
        duration: 30,
      },
      {
        type: "Class F",
        classDate: Date.now() + 86400000,
        duration: 30,
      },
      {
        type: "Class G",
        classDate: Date.now() + 86400000,
        duration: 30,
      },
    ],
    highlightedUpcomingClass: {
      type: "Type A",
      className: "Class G",
      thumbnailUrl: "https://dummyimage.com/200x200",
    },
    liveClasses: [
      {
        thumbnailUrl: "https://dummyimage.com/200x200",
        className: "Class H",
        classDate: Date.now() + 86400000,
      },
    ],
    isOnline: true,
    reviewPoint: 4.5,
    price: 200000,
    isCertified: false,
    joinedAt: Date.now(),
    certificates: [
      {
        title: "string",
        orgName: "string",
        fileUrl: "string",
      },
    ],
    rating: 5,
    schedules: ["09:00-10:00", "10:00-11:00"],
    nickname: "Nickname",
    bio: "Bio 001",
    gender: "male",
    lastEducation: "S1",
    company: {
      name: "Dummy Company",
      jobLevel: "Staff",
      jobRole: "Pengajar",
    },
    providerFee: 30,
    mentorFee: 70,
    feeAcceptedAt: Date.now(),
  });

  dummyMentorUsers.push(mentor.unmarshall());
  dummyMentorProfiles.push(mentorProfile.unmarshall());
}
container.rebind<AuthService>(AuthService).toSelf().inSingletonScope();
const authService = container.get<AuthService>(AuthService);
const userService = container.get<UserService>(UserService);
const participantRepository = container.get<IParticipantRepository>(TYPES.ParticipantRepository);
const mentorRepository = container.get<IMentorRepository>(TYPES.MentorRepository);
const bookService = container.get<BookService>(BookService);

Promise.all([
  userService.save(userSuperAdmin.unmarshall()),
  userService.save(userAdmin.unmarshall()),
  userService.save(participant1.unmarshall()),
  userService.save(participant2.unmarshall()),
  (() => {
    dummyMentorProfiles.forEach((entity) => {
      mentorRepository.save(entity);
    });
    dummyMentorUsers.forEach((entity) => {
      userService.save(entity);
    });
  })(),
  userService.save(userOrganization.unmarshall()),
  participantRepository.save(participantProfile1.unmarshall()),
  participantRepository.save(participantProfile2.unmarshall()),
]).then(async () => {
  await (async () => {
    // Finished Order
    let auth = await authService.login(participant1.email, "password");
    bookService.setAuth(auth);
    const book = await bookService.book(
      dummyMentorProfiles[0].id,
      dummyMentorProfiles[0].schedules,
      dummyMentorProfiles[0].className[0],
      "OVO",
      "080898987878",
      120,
      Date.now()
    );
    auth = await authService.login(dummyMentorUsers[0].email, "password");
    bookService.setAuth(auth);
    await bookService.accept(book.id);
    await bookService.setPaid(book.id);
    await bookService.finish(book.id, 5, "OK");
  })();
  await (async () => {
    // Canceled Order
    const auth = await authService.login(participant1.email, "password");
    bookService.setAuth(auth);
    const book = await bookService.book(
      dummyMentorProfiles[0].id,
      dummyMentorProfiles[0].schedules,
      dummyMentorProfiles[0].className[0],
      "OVO",
      "080898987878",
      120,
      Date.now()
    );
    await bookService.cancel(book.id);
  })();
  await (async () => {
    // Rejected Order
    let auth = await authService.login(participant1.email, "password");
    bookService.setAuth(auth);
    const book = await bookService.book(
      dummyMentorProfiles[0].id,
      dummyMentorProfiles[0].schedules,
      dummyMentorProfiles[0].className[0],
      "OVO",
      "080898987878",
      120,
      Date.now()
    );
    auth = await authService.login(dummyMentorUsers[0].email, "password");
    bookService.setAuth(auth);
    await bookService.reject(book.id);
  })();

  await (async () => {
    // Pending Order
    let auth = await authService.login(participant1.email, "password");
    bookService.setAuth(auth);
    const book = await bookService.book(
      dummyMentorProfiles[0].id,
      dummyMentorProfiles[0].schedules,
      dummyMentorProfiles[0].className[0],
      "OVO",
      "080898987878",
      120,
      Date.now()
    );
  })();

  await (async () => {
    // Waiting Payment Order
    let auth = await authService.login(participant1.email, "password");
    bookService.setAuth(auth);
    const book = await bookService.book(
      dummyMentorProfiles[0].id,
      dummyMentorProfiles[0].schedules,
      dummyMentorProfiles[0].className[0],
      "OVO",
      "080898987878",
      120,
      Date.now()
    );
    auth = await authService.login(dummyMentorUsers[0].email, "password");
    bookService.setAuth(auth);
    await bookService.accept(book.id);
  })();
});
