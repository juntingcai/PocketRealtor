const constant = require("../static/Constant");

class Response{
  success(res){
    res.json({
      code: constant.RESPONSE.SUCCESS.code,
      msg: constant.RESPONSE.SUCCESS.msg,
    });
  }
  
  success_login(res, token){
    res.json({
      code: constant.RESPONSE.SUCCESS.code,
      msg: constant.RESPONSE.SUCCESS.msg,
      token: token
    });
  }
  
  noDataFound(res){
    res.json({
      code: constant.RESPONSE.NO_DATA.code,
      msg: constant.RESPONSE.NO_DATA.msg,
    });
  }

  fail(res){
    res.json({
      code: constant.RESPONSE.FAIL.code,
      msg: constant.RESPONSE.FAIL.msg,
    });
  }

  tokenError(res){
    res.json({
      code: constant.RESPONSE.TOKEN_ERR.code,
      msg: constant.RESPONSE.TOKEN_ERR.msg,
    });
  }

  userNotExist(res){
    res.json({
      code: constant.RESPONSE.USER_NOT_EXIST.code,
      msg: constant.RESPONSE.USER_NOT_EXIST.msg,
    });
  }

  missFileds(res){
    res.json({
      code: constant.RESPONSE.MISS_FIELD.code,
      msg: constant.RESPONSE.MISS_FIELD.msg,
    });
  }

  wrongFormat(res){
    res.json({
      code: constant.RESPONSE.WRONG_FMT.code,
      msg: constant.RESPONSE.WRONG_FMT.msg,
    });
  }

  wrongPassword(res){
    res.json({
      code: constant.RESPONSE.WRONG_PWD.code,
      msg: constant.RESPONSE.WRONG_PWD.msg,
    });
  }

  emailExist(res){
    res.json({
      code: constant.RESPONSE.EMAIL_EXIST.code,
      msg: constant.RESPONSE.EMAIL_EXIST.msg,
    });
  }

}

module.exports = new Response();