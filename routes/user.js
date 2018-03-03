var express = require('express');
var router = express.Router();
var loginCheckMiddleware = require('../util').loginCheckMiddleware;
var mysqal = require('../util').mysql;
var userTable = 'user';

router.use(loginCheckMiddleware);

router.all('*', function(req, res, next) {
  if(!req.session) {
    res.status(401).json({
      error: '未登录'
    });
    return;
  }
  next();
});

// 获取用户
router.get('/', function (req, res, next) {

  mysql(userTable).where({
      open_id: req.session.open_id
    })
    .select('*')
    .then(function(result) {
      if(result.length > 0) {
        var data = result[0];
        res.json({
          name: data.name,
          avatar: data.avatar
        });
      }
      else {
        res.status(400).json({
          error: '未创建用户'
        });
      }
    });

});

//新增用户
router.post('/', function (req, res, next) {

  var userInfo = req.body;

  if (!userInfo.name || !userInfo.avatar) {

    res.status(400).json({
      error: '参数错误'
    });

    return;
  }

  mysql(userTable).where({
      open_id: req.session.open_id
    })
    .count('open_id as hasUser')
    .then(function(res) {
      if(res[0].hasUser) {
        res.status(400).json({
          error: '用户已创建'
        });
      }
      else {
        mysql(userTable).insert({
          name: userInfo.name,
          avatar: userInfo.avatar
        })
          .then(function () {
            res.json(userInfo);
          });
      }
    });

});

//更新用户
router.put('/', function (req, res, next) {

  var userInfo = req.body;

  if(!userInfo.name || !userInfo.avatar) {

    res.status(400).json({
      error: '参数错误'
    });
    
    return;
  }

  mysql(userTable).where({
      open_id: req.session.open_id
    }).update({
      name: userInfo.name,
      avatar: userInfo.avatar
    })
    .then(function() {
      res.json(userInfo);
    });

});

module.exports = router;