var express = require('express');
var fs = require('fs');
var multiparty = require('multiparty');
// 腾讯云的文件存储SDK
var CosSdk = require('cos-nodejs-sdk-v5');
var router = express.Router();
var loginCheckMiddleware = require('../util').loginCheckMiddleware;
var mysql = require('../util').mysql;
var config = require('../config');

// 获取腾讯云配置
// serverHost, tunnelServerUrl, tunnelSignatureKey, qcloudAppId, qcloudSecretId, qcloudSecretKey, wxMessageToken
var qcloudConfig = JSON.parse(fs.readFileSync('/data/release/sdk.config.json', 'utf8'));
var userTable = 'user';

// 文件存储sdk初始化
var cos = new CosSdk({
  AppId: qcloudConfig.qcloudAppId,
  SecretId: qcloudConfig.qcloudSecretId,
  SecretKey: qcloudConfig.qcloudSecretKey
});

router.use(loginCheckMiddleware);

router.all('*', function (req, res, next) {
  if (!req.session) {
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
    .then(function (result) {
      if (result.length > 0) {
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
    .then(function (ret) {
      if (ret[0].hasUser) {
        res.status(400).json({
          error: '用户已创建'
        });
      }
      else {
        userInfo = {
          open_id: req.session.open_id,
          name: userInfo.name,
          avatar: userInfo.avatar
        };
        mysql(userTable).insert(userInfo)
          .then(function () {
            delete userInfo.open_id;
            res.json(userInfo);
          });
      }
    });

});

//更新用户
// router.patch('/', function (req, res, next) {
router.put('/', function (req, res, next) {

  var userInfo = req.body;

  if (!userInfo.name && !userInfo.avatar) {

    res.status(400).json({
      error: '参数错误'
    });

    return;
  }

  var updateData = userInfo.name ? {
    name: userInfo.name
  } : {
    avatar: userInfo.avatar
  };

  mysql(userTable).where({
    open_id: req.session.open_id
  }).update(updateData)
    .then(function () {
      res.json(updateData);
    });

});

router.post('/avatar', function(req, res, next) {

  // 用于解析文件上传
  var form = new multiparty.Form({
    encoding: 'utf8',
    autoFiles: true,
    uploadDir: '/tmp'
  });

  form.parse(req, function(err, fields, files) {
    
    if(err) {
      next(err);
    }
    else {
      var avatarFile = files.avatar[0];
      var fileExtension = avatarFile.path.split('.').pop();
      var fileKey = parseInt(Math.random() * 10000000) + '_' + (+new Date) + '.' + fileExtension;
      
      var params = {
        //todo
        Bucket: config.cos.fileBucket,
        //ap-guangzhou
        Region: config.cos.region,
        Key: fileKey,
        Body: fs.readFileSync(avatarFile.path),
        ContentLength: avatarFile.size
      };
      
      cos.putObject(params, function (err, data) {
        // 删除临时文件
        fs.unlink(avatarFile.path);
        if (err) {
          next(err);
          return;
        }

        if(!/^http/.test(data.Location)) data.Location = 'https://' + data.Location;

        res.end(data.Location);
      });

    }

  });

});

module.exports = router;