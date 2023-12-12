import "reflect-metadata";
import { EROLES } from "@/common/utils/roles";
import { Participant, User } from "@/domain/model";
import { container } from "@/ioc/container";
import { UserService } from "@/services";
import { EGENDERS } from "@/common/utils/genders";
import { IMentorRepository, IParticipantRepository } from "@/domain/service";
import { MentorRepository, ParticipantRepository } from "@/infra/mongodb";
import { Mentor } from "@/domain/model/mentor";
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
  email: "participant1@admin.com",
  roles: [EROLES.PARTICIPANT],
});
participant1.password = "password";

const participant2 = User.create({
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
const dummyMentorProfiles: any[] = [];
const dummyMentorUsers: any[] = [];

for (let i = 0; i < 200; i++) {
  const mentor = User.create({
    email: `mentor${i + 1}@admin.com`,
    roles: [EROLES.MENTOR],
  });
  mentor.password = "password";

  const mentorProfile = Mentor.create({
    userId: mentor.id,
    username: `dummyUsername${i + 1}`,
    fullname: `Dummy User ${i + 1}`,
    avatarUrl: "https://dummyimage.com/200x200",
    className: ["Class A", "Class B"],
    bankInfo: {
      accountName: "Dummy Account",
      accountNo: "1234567890",
      name: "Dummy Bank",
    },
    company: {
      name: "Dummy Company",
    },
    graduateFrom: {
      name: "Dummy University",
      region: "Dummy Region",
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
  });

  dummyMentorUsers.push(mentor.unmarshall());
  dummyMentorProfiles.push(mentorProfile.unmarshall());
}

const userService = container.get<UserService>(UserService);
const participantRepository = container.get<IParticipantRepository>(TYPES.ParticipantRepository);
const mentorRepository = container.get<IMentorRepository>(TYPES.MentorRepository);

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
]).then((result) => {
  console.log(result);
});
