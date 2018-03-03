var express = require('express');
var router = express.Router();
var loginCheckMiddleware = require('../util').loginCheckMiddleware;

router.use(loginCheckMiddleware);

// 中间件测试
router.get('/', function (req, res, next) {

  if(req.session) {
    //通过session里的openid获取用户信息
    var userInfo = null;

    res.json({
      isLogin: true,
      userInfo: userInfo
    });

  }
  else {
    res.json({
      isLogin: false
    });
  }

});

module.exports = router;