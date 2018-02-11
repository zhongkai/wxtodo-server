var express = require('express');
var request = require('request');
var crypto = require('crypto');
var moment = require('moment');
var router = express.Router();
var config = require('../config');
var mysql = require('../util').mysql;
var sessionTable = 'session';

function sha1(message) {
  return crypto.createHash('sha1').update(message, 'utf8').digest('hex');
}

router.get('/', function (req, res, next) {

  var code = req.query.code;
  var curTime = moment().format('YYYY-MM-DD HH:mm:ss');

  request.get({
    uri: 'https://api.weixin.qq.com/sns/jscode2session',
    json: true,
    qs: {
      grant_type: 'authorization_code',
      appid: config.appid,
      secret: config.secret,
      js_code: code
    }
  }, function (err, response, data) {
    if (response.statusCode === 200) {
      var sessionKey = data.session_key;
      var openId = data.openid;
      var skey = sha1(sessionKey);
      var sessionData = {
        skey: skey,
        create_time: curTime,
        last_login_time: curTime,
        session_key: sessionKey
      };

      mysql(sessionTable).count('open_id as hasUser').where({
        open_id: openId
      })
        .then(function(res) {
          // 如果存在用户就更新session
          if (res[0].hasUser) {
            return mysql(sessionTable).update(sessionData).where({
              open_id: openId
            });
          } 
          // 如果不存在用户就新建session
          else {
            sessionData.open_id = openId;
            return mysql(sessionTable).insert(sessionData);
          }
        })
        .then(function() {
          res.json({
            skey: skey
          });
        })
        .catch(e => {
          res.json({
            skey: null
          });
        });

    } else {
      res.json({
        skey: null
      });
    }
  });

});

module.exports = router;