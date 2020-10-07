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
    let user = {};
    let firstname = profile.firstname;
    let lastname = profile.lastname;
    let birthday = profile.birthday;
    let nickname = profile.nickname;
    let intro = profile.intro;

    if (firstname) {
      user.first_name = firstname;
    }
    if (lastname) {
      user.last_name = lastname;
    }
    if (birthday) {
      // let bd = new Date(birthday);
      user.birthday = birthday;
    }
    if (nickname) {
      user.nickname = nickname;
    }
    if (intro) {
      user.intro = intro;
    }

    return await User.update(user, { where: { id: id } });
  }

  async updateAvatar(userId, avatar) {
    return await User.update(
      { avatar: avatar },
      {
        where: { id: userId },
      }
    );
  }

  async query(){
    return User.findAll({ where: { nickname: null } });
  }

}

module.exports = new UserModel();
