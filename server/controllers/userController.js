const { sequelize, Sequelize } = require("../database/dbConnection");
const constant = require("../static/Constant");
const resTemplate = require("../utils/Response");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

class user {
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
      resTemplate.success(res);
    }

    if (!isEmailLegal(email)) {
      resTemplate.wrongFormat(res);
    }

    if (!isPasswordLegal(password)) {
      resTemplate.wrongFormat(res);
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
            .then(() => {
              resTemplate.success(res);
            })
            .catch((err) => {
              resTemplate.noDataFound(res);
            });
        } else {
          resTemplate.emailExist(res);
        }
      })
      .catch((err) => {
        resTemplate.fail(res);
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
      resTemplate.missFileds(res);
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
          resTemplate.success_login(res, token);
        } else {
          resTemplate.userNotExist(res);
        }
      } else {
        resTemplate.userNotExist(res);
      }
    });
  }

  // just for dev
  testUserToken(req, res, next) {
    // let reqUser = req.body.user;
    // User.findUserById(reqUser.id).then((user) => {
    //   if (user) {
    //     resTemplate.success(res);
    //   } else {
    //     resTemplate.userNotExist(res);
    //   }
    // });
    res.json(req.body.user);
  }

  updatePassword(req, res, next) {
    let reqUser = req.body.user;
    let userId = reqUser.id;
    let oldPwd = req.body.oldPassword;
    let newPwd = req.body.newPassword;

    if (!userId || !oldPwd || !newPwd) {
      resTemplate.missFileds(res);
      return;
    }

    User.findUserById(userId).then((user) => {
      // check user exists
      if (!user) {
        resTemplate.userNotExist(res);
        return;
      }
      let salt = user.password_salt;
      // check old password
      if (user.password_hashed !== hashPassword(salt, oldPwd)) {
        resTemplate.wrongPassword(res);
        return;
      }
      // check new password
      if (!isPasswordLegal(newPwd)) {
        resTemplate.wrongFormat(res);
        return;
      }
      // hash new password
      let newHashedPwd = hashPassword(salt, newPwd);
      User.updatePassword(user.id, newHashedPwd)
        .then(() => {
          resTemplate.success(res);
        })
        .catch((err) => {
          resTemplate.fail(res);
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

    if (!reqUserId) {
      resTemplate.tokenError(res);
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

    User.updateProfile(reqUserId, profile)
      .then(() => {
        resTemplate.success(res);
      })
      .catch((err) => {
        console.log(err);
        resTemplate.fail(res);
      });
  }

  getUserProfile(req, res, next) {
    let userId = req.params.userId;

    if (!userId) {
      res.json({
        success: false,
        message: "Please specify userId",
      });
    }

    User.findUserById(userId).then((user) => {
      if (user) {
        let resUser = {
          email: user.email,
          firstname: user.first_name,
          lastname: user.last_name,
          nickname: user.nickname,
          birthday: user.birthday,
          intro: user.intro,
        };
        res.json({ success: true, data: resUser });
      } else {
        res.json({
          success: false,
          message: "Cannot find the user",
        });
      }
    });
  }

  verifyToken(req, res, next) {
    const token = req.header("Authorization");
    jwt.verify(token, constant.jwtsecret, function (err, decoded) {
      if (err) {
        resTemplate.tokenError(res);
      } else {
        // check user info
        let decodedUser = decoded.user;
        if (!decodedUser) {
          resTemplate.tokenError(res);
        }

        let userId = decodedUser.id;
        let email = decodedUser.email;
        let pwdHash = decodedUser.hash;

        if (!userId || !email || !pwdHash) {
          console.log("Token Fields Missed")
          resTemplate.tokenError(res);
        }

        User.findUserById(userId)
          .then((user) => {
            if (
              !user ||
              userId !== user.id ||
              user.email !== email ||
              user.password_hashed !== pwdHash
              
            ) {
              console.log("Cannot find user info")
              resTemplate.tokenError(res);
            } else{
              console.log("token passed")
              req.body.user = user;
              next();
            }
          })
          .catch((err) => {
            console.log("Error happened" + err);
            resTemplate.tokenError(res);
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
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const result = re.test(email);
  return result;
}

function isPasswordLegal(password) {
  // const re =  /^[A-Za-z]\w{7,14}$/; // between 7 to 16 characters and contain only characters, numeric digits, underscore and first character must be a letter
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // between 6 to 20 characters and contain at least one numeric digit, one uppercase and one lowercase letter
  const result = re.test(password);
  return result;
}

module.exports = new user();
