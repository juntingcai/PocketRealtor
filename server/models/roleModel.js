const RoleType = require("../static/RoleType");
const { UserRole, User } = require("./models");

class UserRoleModel {
  createUserRole(userId, roleType) {
    UserRole.findOne({ where: { user_id: userId, role_id: roleType.id } }).then(
      (role) => {
        if (!role) {
          UserRole.create({
            user_id: userId,
            role_id: roleType.id,
          });
        }
      }
    );
  }

  updateUserRole(userId, roleType) {}

  deleteUserRole(userId, roleType) {}

  findUserRole(userId) {
    return UserRole.findAll({ where: { user_id: userId } });
  }
}
