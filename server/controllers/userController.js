const { sequelize, Sequelize } = require("../database/dbConnection");
const constant = require("../static/Constant");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const { resolveSoa } = require("dns");

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
      res.json({
        code: constant.RESPONSE.NO_DATA.code,
        msg: constant.RESPONSE.NO_DATA.msg,
        //data: err,
      });
    }

    if (!isEmailLegal(email)) {
      res.json({
        code: constant.RESPONSE.NO_DATA.code,
        msg: constant.RESPONSE.NO_DATA.msg,
      });
    }

    if (!isPasswordLegal(password)) {
      res.json({
        code: constant.RESPONSE.NO_DATA.code,
        msg: constant.RESPONSE.NO_DATA.msg,
      });
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
            .then((result) => {
              res.json({
                code: constant.RESPONSE.SUCCESS.code,
                msg: constant.RESPONSE.SUCCESS.msg,
              });
            })
            .catch((err) => {
              res.json({
                code: constant.RESPONSE.NO_DATA.code,
                msg: constant.RESPONSE.NO_DATA.msg,
              });
            });
        } else {
          res.json({
            // email exists
            code: constant.RESPONSE.EMAIL_EXIST.code,
            msg: constant.RESPONSE.EMAIL_EXIST.msg,
          });
        }
      })
      .catch((err) => {
        res.json({
          // email exists
          code: constant.RESPONSE.FAILD.code,
          msg: constant.RESPONSE.FAILD.msg,
        });
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
      res.json({
        code: constant.RESPONSE.MISS_FIELD.code,
        msg: constant.RESPONSE.MISS_FIELD.msg,
      });
    }

    User.findUserByEmail(email).then((user) => {
      if (user) {
        let salt = user.password_salt;
        let hashedPassword = hashPassword(salt, password);
        if (hashedPassword === user.password_hashed) {
          let token = generateAuthToken({
            id: user.id,
            email: user.email,
            firstname: user.first_name,
          });
          res.json({
            code: constant.RESPONSE.SUCCESS.code,
            msg: constant.RESPONSE.SUCCESS.msg,
            token: token,
          });
        } else {
          res.json({
            code: constant.RESPONSE.USER_NOT_EXIST.code,
            msg: constant.RESPONSE.USER_NOT_EXIST.msg,
          });
        }
      } else {
        res.json({
          code: constant.RESPONSE.USER_NOT_EXIST.code,
          msg: constant.RESPONSE.USER_NOT_EXIST.msg,
        });
      }
    });
  }

  // just for dev
  testUserToken(req, res, next) {
    let reqUser = req.body.user;
    User.findUserById(reqUser.id).then((user) => {
      if (user) {
        res.json({
          code: constant.RESPONSE.SUCCESS.code,
          msg: constant.RESPONSE.SUCCESS.msg,
        });
        // console.log(user);
      } else {
        res.json({
          code: constant.RESPONSE.USER_NOT_EXIST.code,
          msg: constant.RESPONSE.USER_NOT_EXIST.msg,
        });
      }
    });
  }

  updatePassword(req, res, next) {
    let reqUser = req.body.user;
    let userId = reqUser.id;
    let oldPwd = req.body.oldPassword;
    let newPwd = req.body.newPassword;

    if (!userId || !oldPwd || !newPwd) {
      res.json({
        code: constant.RESPONSE.MISS_FIELD.code,
        msg: constant.RESPONSE.MISS_FIELD.msg,
      });
    }

    User.findUserById(userId).then((user) => {
      // check user exists
      if (!user) {
        res.json({
          code: constant.RESPONSE.USER_NOT_EXIST.code,
          msg: constant.RESPONSE.USER_NOT_EXIST.msg,
        });
        return;
      }
      let salt = user.password_salt;
      // check old password
      if (user.password_hashed !== hashPassword(salt, oldPwd)) {
        res.json({
          code: constant.RESPONSE.WRONG_PWD.code,
          msg: constant.RESPONSE.WRONG_PWD.msg,
        });
        return;
      }
      // check new password
      if (!isPasswordLegal(newPwd)) {
        res.json({
          code: constant.RESPONSE.WRONG_FMT.code,
          msg: constant.RESPONSE.WRONG_FMT.msg,
        });
        return;
      }
      // hash new password
      let newHashedPwd = hashPassword(salt, newPwd);
      User.updatePassword(user.id, newHashedPwd)
        .then(() => {
          // success
          res.json({
            code: constant.RESPONSE.SUCCESS.code,
            msg: constant.RESPONSE.SUCCESS.msg,
          });
        })
        .catch((err) => {
          // database error
          res.json({
            code: constant.RESPONSE.DATABASE_ERROR.code,
            msg: constant.RESPONSE.DATABASE_ERROR.msg,
            err: err,
          });
        });
    });
  }

  verifyToken(req, res, next) {
    const token = req.header("Authorization");
    jwt.verify(token, constant.jwtsecret, function (err, decoded) {
      if (err) {
        res.json({
          code: constant.RESPONSE.TOKEN_ERR.code,
          msg: constant.RESPONSE.TOKEN_ERR.msg,
        });
      } else {
        req.body.user = decoded.user;
        next();
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
