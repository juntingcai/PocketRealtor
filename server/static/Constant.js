const RESPONSE = {
  SUCCESS: {code: 10000, msg: 'Request Success'},
  EMAIL_EXIST: {code: 40001, msg: 'The email has existed'},
  NO_DATA:{code: 40002, msg: 'No data found'},
  NO_LOGIN: {code: 40003, msg: 'No Login'},
  FORBIDDEN: {code: 40004, msg: 'Forbidden'},
  USER_NOT_EXIST:{code: 40005, msg: 'User does not exist'},
  WRONG_PWD: {code: 40006, msg: 'Wrong password'},
  WRONG_FMT: {code: 40007, msg: 'Wrong format'},
  DATABASE_ERROR: {code: 40008, msg: 'Some issues happends in database'},
  FAILD: {code: 50003, msg: 'Fail Rquest'},
  TOKEN_NO_FIND: {code: 60001, msg: 'Token not found, please login again'},
  TOKEN_ERR: {code: 60002, msg: 'Invalid token'},
  MISS_FIELD:{code: 40008, msg: 'Missing Required Fields'}

};

exports.RESPONSE = RESPONSE;
exports.jwtsecret='dev-jwe-secret'