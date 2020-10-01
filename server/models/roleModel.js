const RoleType = require("../static/RoleType");
const { UserRole, User } = require("./models");

class UserRoleModel {
  async updateUserRole(userId, roleType) {
    if (!roleType.isHost && !roleType.isRenter && !roleType.isAgent) {
      return;
    }

    await UserRole.destroy({ where: { user_id: userId } }).then(() => {
      if (roleType.isHost && roleType.isRenter) {
        return UserRole.bulkCreate([
          {
            user_id: userId,
            role_id: RoleType.HOST.id,
          },
          {
            user_id: userId,
            role_id: RoleType.RENTER.id,
          },
        ]);
      } else if (roleType.isHost) {
        return UserRole.create({
          user_id: userId,
          role_id: RoleType.HOST.id,
        });
      } else if (roleType.isRenter) {
        return UserRole.create({
          user_id: userId,
          role_id: RoleType.RENTER.id,
        });
      } else if (roleType.isAgent) {
        return UserRole.create({
          user_id: userId,
          role_id: RoleType.AGENT.id,
        });
      }
    });
  }
}

module.exports = new UserRoleModel();
