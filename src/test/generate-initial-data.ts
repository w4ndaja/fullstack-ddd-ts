import { ERoles } from "@/common/utils/roles";
import { User } from "@/domain/model";
import { container } from "@/ioc/container";
import { UserService } from "@/services";

const superAdmin = User.create({
  email: "super@admin.com",
  roles: [ERoles.SUPER_ADMIN],
});
superAdmin.password = "password";

const admin = User.create({
  email: "admin@admin.com",
  roles: [ERoles.ADMIN],
});
admin.password = "password";

const userService = container.get<UserService>(UserService);

userService.save(superAdmin.unmarshall());
userService.save(admin.unmarshall());
