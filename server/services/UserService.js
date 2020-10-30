const RoleType = require("../static/RoleType");
const crypto = require("crypto");
const constant = require("../static/Constant");
const { User, UserRole } = require("../models/models");
const resTemplate = require("../static/ResponseTemplate");
const jwt = require("jsonwebtoken");
class UserService {
  register(user, res) {
    let email = user.email;
    var password = user.password;
    let firstname = user.firstname;
    let lastname = user.lastname;

    User.count({ where: { email: email } })
      .then((cnt) => {
        if (cnt > 0) {
          res.json(resTemplate.EMAIL_EXIST);
          return;
        }
        // generate salt
        let salt = crypto.randomBytes(16).toString("hex");
        // hash password with salt
        let hashedPassword = hashPassword(salt, password);

        let newUser = {
          email: email,
          password_salt: salt,
          password_hashed: hashedPassword,
          first_name: firstname,
          last_name: lastname,
        };

        User.create(newUser)
          .then((user) => {
            let token = generateAuthToken({
              id: user.id,
              email: user.email,
              hash: hashedPassword,
            });
            let resSuccess = {
              code: resTemplate.SUCCESS.code,
              msg: resTemplate.SUCCESS.msg,
              token: token,
            };
            res.json(resSuccess);
            return;
          })
          .catch((err) => {
            console.log(err);
            res.status.send(err);
            return;
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
        return;
      });
  }

  login(email, password, res) {
    User.findOne({ where: { email: email } }).then((user) => {
      if (!user) {
        res.json(resTemplate.USER_NOT_EXIST);
        return;
      }

      let salt = user.password_salt;
      let hashedPassword = hashPassword(salt, password);
      if (hashedPassword === user.password_hashed) {
        let token = generateAuthToken({
          id: user.id,
          email: user.email,
          hash: hashedPassword,
        });
        let resSuccess = {
          code: resTemplate.SUCCESS.code,
          msg: resTemplate.SUCCESS.msg,
          token: token,
        };
        res.json(resSuccess);
        return;
      } else {
        res.json(resTemplate.USER_NOT_EXIST);
        return;
      }
    });
  }

  updatePassword(userId, oldPwd, newPwd, res) {
    User.findByPk(userId)
      .then((user) => {
        if (!user) {
          res.json(resTemplate.NO_DATA);
          return;
        }

        let salt = user.password_salt;
        // check old password
        if (user.password_hashed !== hashPassword(salt, oldPwd)) {
          res.json(resTemplate.INCORRECT_PASSWORD);
          return;
        }
        // check new password
        if (!isPasswordLegal(newPwd)) {
          res.json(resTemplate.INVALID_PASSWORD);
          return;
        }
        let newHashedPwd = hashPassword(salt, newPwd);
        user.password_hashed = newHashedPwd;
        user.save().then(() => {
          res.json(resTemplate.SUCCESS);
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  }

  updateRole(userId, roleType, res) {
    UserRole.destroy({ where: { user_id: userId } })
      .then(() => {
        if (roleType.isHost && roleType.isRenter) {
          UserRole.bulkCreate([
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
          UserRole.create({
            user_id: userId,
            role_id: RoleType.HOST.id,
          });
        } else if (roleType.isRenter) {
          UserRole.create({
            user_id: userId,
            role_id: RoleType.RENTER.id,
          });
        } else if (roleType.isAgent) {
          UserRole.create({
            user_id: userId,
            role_id: RoleType.AGENT.id,
          });
        }
        res.json(resTemplate.SUCCESS);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  }

  updateProfile(userId, profile, res) {
    User.update(profile, { where: { id: userId } })
      .then((user) => {
        res.json(resTemplate.SUCCESS);
      })
      .catch((err) => {
        console.log(err);
        res.status(500);
        return;
      });
  }

  async getUserById(userId) {
    return await User.findByPk(userId)
      .then((user) => {
        if (user) {
          let resUser = {
            email: user.email,
            firstname: user.first_name,
            lastname: user.last_name,
            nickname: user.nickname,
            birthday: user.birthday,
            gender: user.gender,
            occupation: user.occupation,
            intro: user.intro,
            avatar: user.avatar,
          };
          return resUser;
        } else {
          return undefined;
        }
      })
      .catch((err) => {
        console.log(err);
        return undefined;
      });
  }

  getUserRoles(userId) {
    return UserRole.findAll({
      attributes: ["role_id"],
      raw: true,
      where: { user_id: userId },
    }).then((roles) => {
      return roles;
    });
  }

  async updateUserAvatar(userId, avatar) {
    return await User.findByPk(userId)
      .then((user) => {
        if (!user) {
          return false;
        }
        if (avatar) {
          user.avatar = avatar;
        } else {
          user.avatar = null;
        }
        return user.save().then(() => {
          return true;
        });
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  async isUserValid(userId, email, hashedPassword) {
    return await User.findByPk(userId).then((user) => {
      if (
        !user ||
        userId !== user.id ||
        user.email !== email ||
        user.password_hashed !== hashedPassword
      ) {
        return undefined;
      }
      return user;
    });
  }

  async checkUserRole(userId, roleId) {
    return await this.getUserRoles(userId).then((roles) => {
      var isUserTheRole = false;
      for (var i = 0; i < roles.length; i++) {
        let role = roles[i];
        if (role.role_id === roleId) {
          isUserTheRole = true;
          break;
        }
      }
      return isUserTheRole;
    });
  }
}

const generateAuthToken = function (user) {
  let token = jwt.sign({ user: user }, constant.jwtsecret, {
    expiresIn: "1d", // expire in a day
  });
  return token;
};

const hashPassword = function (salt, pwd) {
  var hmac = crypto.createHmac("sha256", salt);
  return hmac.update(pwd).digest("hex");
};

module.exports = new UserService();
