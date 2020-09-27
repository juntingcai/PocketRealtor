const {User, Role} = require("./models")

class UserModel {
  async createUser(user) {
    user.role_id = 0;
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
}

module.exports = new UserModel();
