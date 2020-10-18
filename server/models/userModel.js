const { User } = require("./models");

class UserModel {
  async createUser(user) {
    return await User.create(user);
  }

  async findUserByEmail(email) {
    return await User.findOne({ where: { email: email } });
  }

  async findUserById(id) {
    return await User.findOne({ where: { id: id } });
  }

  async updatePassword(id, newHashedPassword) {
    return await User.update(
      { password_hashed: newHashedPassword },
      {
        where: { id: id },
      }
    );
  }

  async updateProfile(id, profile) {
    return await User.update(profile, { where: { id: id } });
  }

  async updateAvatar(userId, avatar) {
    return await User.update(
      { avatar: avatar },
      {
        where: { id: userId },
      }
    );
  }
}

module.exports = new UserModel();
