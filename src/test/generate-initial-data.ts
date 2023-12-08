import "reflect-metadata";
import { EROLES } from "@/common/utils/roles";
import { Participant, User } from "@/domain/model";
import { container } from "@/ioc/container";
import { UserService } from "@/services";
import { EGENDERS } from "@/common/utils/genders";

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

const userClient1 = User.create({
  email: "client001@admin.com",
  roles: [EROLES.PARTICIPANT],
});
userClient1.password = "password";

const userClient2 = User.create({
  email: "client002@admin.com",
  roles: [EROLES.PARTICIPANT],
});
userClient2.password = "password";

const userMentor = User.create({
  email: "mentor@admin.com",
  roles: [EROLES.MENTOR],
});
userMentor.password = "password";

const userOrganization = User.create({
  email: "organization@admin.com",
  roles: [EROLES.ORGANISATION],
});
userOrganization.password = "password";

const client1 = Participant.create({
  username: "client1",
  fullname: "Dummy Client 001",
  bio: "I'm dummy client",
  gender: EGENDERS.FEMALE.toString(),
  userId: userClient1.id,
});
const client2 = Participant.create({
  username: "client2",
  fullname: "Dummy Client 002",
  bio: "I'm dummy client",
  gender: EGENDERS.FEMALE.toString(),
  userId: userClient2.id,
});

const userService = container.get<UserService>(UserService);

Promise.all([
  userService.save(userSuperAdmin.unmarshall()),
  userService.save(userAdmin.unmarshall()),
  userService.save(userClient1.unmarshall()),
  userService.save(userClient2.unmarshall()),
  userService.save(userMentor.unmarshall()),
  userService.save(userOrganization.unmarshall()),
]).then((result) => {
  console.log(result);
});
