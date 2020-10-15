const constant = require("../static/Constant");
const resTemplate = require("../static/ResponseTemplate");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const regex = require("../static/Regex");

const User = require("../models/userModel");
const UserRole = require("../models/roleModel");
const RoleType = require("../static/RoleType");
const { Role } = require("../models/models");

class UserController {
  constructor() {}

  register(req, res, next) {
    let email = req.body.email;
    var password = req.body.password;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    if (
      email === undefined ||
      password === undefined ||
      firstname === undefined ||
      lastname === undefined ||
      firstname.length == 0 ||
      lastname.length == 0
    ) {
      res.json(resTemplate.MISS_FIELD);
      return;
    }

    if (!isEmailLegal(email)) {
      res.json(resTemplate.INVALID_EMAIL);
      return;
    }

    if (!isPasswordLegal(password)) {
      res.json(resTemplate.INVALID_PASSWORD);
      return;
    }

    // check if user exists
    User.findUserByEmail(email)
      .then((u) => {
        if (!u) {
          // email does not exist

          // generate salt
          let salt = crypto.randomBytes(16).toString("hex");
          // hash password with salt
          let hashedPassword = hashPassword(salt, password);

          let user = {
            email: email,
            password_salt: salt,
            password_hashed: hashedPassword,
            first_name: firstname,
            last_name: lastname,
          };

          // register user
          User.createUser(user)
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
              responseFail(res, err);
            });
        } else {
          res.json(resTemplate.EMAIL_EXIST);
        }
      })
      .catch((err) => {
        responseFail(res, err);
      });
  }

  login(req, res, next) {
    let email = req.body.email;
    var password = req.body.password;

    if (
      email === undefined ||
      password === undefined ||
      email.length == 0 ||
      password.length == 0
    ) {
      res.json(resTemplate.MISS_FIELD);
    }

    User.findUserByEmail(email).then((user) => {
      if (user) {
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
        } else {
          res.json(resTemplate.USER_NOT_EXIST);
        }
      } else {
        res.json(resTemplate.USER_NOT_EXIST);
      }
    });
  }

  // just for dev
  testUserToken(req, res, next) {
    res.json(req.body.user);
  }

  updateRole(req, res, next) {
    let reqUser = req.body.user;
    let userId = reqUser.id;

    let roleType = {
      isHost: req.body.isHost,
      isRenter: req.body.isRenter,
      isAgent: req.body.isAgent,
    };

    UserRole.updateUserRole(userId, roleType)
      .then(() => {
        res.json(resTemplate.SUCCESS);
      })
      .catch((err) => {
        responseFail(res, err);
      });
  }

  updatePassword(req, res, next) {
    let reqUser = req.body.user;
    let userId = reqUser.id;
    let oldPwd = req.body.oldPassword;
    let newPwd = req.body.newPassword;

    if (!userId || !oldPwd || !newPwd) {
      res.json(resTemplate.MISS_FIELD);
      return;
    }

    User.findUserById(userId).then((user) => {
      // check user exists
      if (!user) {
        res.json(resTemplate.USER_NOT_EXIST);
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
      // hash new password
      let newHashedPwd = hashPassword(salt, newPwd);
      User.updatePassword(user.id, newHashedPwd)
        .then(() => {
          res.json(resTemplate.SUCCESS);
        })
        .catch((err) => {
          responseFail(res, err);
        });
    });
  }

  updateProfile(req, res, next) {
    let reqUserId = req.body.user.id;

    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let birthday = req.body.birthday;
    let nickname = req.body.nickname;
    let intro = req.body.intro;

    let gender = req.body.gender;
    let occupation = req.body.occupation;

    if (!reqUserId) {
      res.json(resTemplate.TOKEN_ERR);
    }

    let profile = {};
    if (firstname) {
      profile.firstname = firstname;
    }

    if (lastname) {
      profile.lastname = lastname;
    }

    if (birthday) {
      profile.birthday = birthday;
    }

    if (nickname) {
      profile.nickname = nickname;
    }

    if (intro) {
      profile.intro = intro;
    }

    if(gender){
      profile.gender = gender;
    }

    if(occupation){
      profile.occupation = occupation;
    }

    User.updateProfile(reqUserId, profile)
      .then(() => {
        res.json(resTemplate.SUCCESS);
      })
      .catch((err) => {
        responseFail(res, err);
      });
  }

  getUserProfile(req, res, next) {
    let userId = req.params.userId;

    if (!userId) {
      res.json(resTemplate.MISS_FIELD);
    }

    User.findUserById(userId).then((user) => {
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
        let resSuccess = {
          code: resTemplate.SUCCESS.code,
          msg: resTemplate.SUCCESS.msg,
          data: resUser,
        };
        res.json(resSuccess);
      } else {
        res.json(resTemplate.USER_NOT_EXIST);
      }
    });
  }

  getUserRole(req, res, next) {
    let userId = req.params.userId;
    if (!userId) {
      res.json(resTemplate.MISS_FIELD);
    }

    UserRole.getUserRole(userId)
      .then((roles) => {
        if (!roles) {
          res.json(resTemplate.NO_DATA);
          return;
        }
        var resRoles = [];
        for (var i = 0; i < roles.length; i++) {
          let role = roles[i];
          let roleId = role.role_id;
          switch (roleId) {
            case RoleType.RENTER.id:
              role.role_name = RoleType.RENTER.name;
              break;
            case RoleType.HOST.id:
              role.role_name = RoleType.HOST.name;
              break;
            case RoleType.AGENT.id:
              role.role_name = RoleType.AGENT.name;
              break;

            default:
              break;
          }
          resRoles.push(role);
        }
        res.json(resRoles)
      })
      .catch((err) => {
        responseFail(res, err);
      });
  }

  updateAvatar(req, res, next) {
    let userId = req.body.user.id;
    let avatar = req.body.avatar;
    User.updateAvatar(userId, avatar)
      .then(() => res.json(resTemplate.SUCCESS))
      .catch((err) => {
        responseFail(res, err);
      });
  }

  verifyToken(req, res, next) {
    const token = req.header("Authorization");
    jwt.verify(token, constant.jwtsecret, function (err, decoded) {
      if (err) {
        res.json(resTemplate.TOKEN_ERR);
      } else {
        // check user info
        let decodedUser = decoded.user;
        if (!decodedUser) {
          res.json(resTemplate.TOKEN_ERR);
        }

        let userId = decodedUser.id;
        let email = decodedUser.email;
        let pwdHash = decodedUser.hash;

        if (!userId || !email || !pwdHash) {
          console.log("Token Fields Missed");
          res.json(resTemplate.TOKEN_ERR);
        }

        User.findUserById(userId)
          .then((user) => {
            if (
              !user ||
              userId !== user.id ||
              user.email !== email ||
              user.password_hashed !== pwdHash
            ) {
              console.log("Cannot find user info");
              res.json(resTemplate.TOKEN_ERR);
            } else {
              console.log("token passed");
              req.body.user = user;
              next();
            }
          })
          .catch((err) => {
            responseFail(res, err);
          });
      }
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

function isEmailLegal(email) {
  const re = regex.EMAIL;
  const result = re.test(email);
  return result;
}

function isPasswordLegal(password) {
  // const re =  /^[A-Za-z]\w{7,14}$/; // between 7 to 16 characters and contain only characters, numeric digits, underscore and first character must be a letter
  const re = regex.PASSWORD1;
  const result = re.test(password);
  return result;
}

/**
 * This function is for debug purpose
 */
function responseFail(res, err) {
  let fail = resTemplate.FAIL;
  fail.msg += err;
  res.json(fail);
}

module.exports = new UserController();
