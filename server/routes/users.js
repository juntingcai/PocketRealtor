var express = require('express');
var router = express.Router();

const User = require("../controllers/userController");

/* GET users listing. */
router.get('/user', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', User.register);
router.post('/login', User.login)

router.post('/testUserToken', User.verifyToken ,User.testUserToken)
router.post('/updatePassword', User.verifyToken, User.updatePassword)

module.exports = router;
