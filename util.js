var moment = require('moment');
var config = require('./config');
var sessionTable = 'session';

var mysql = require('knex')({
  client: 'mysql',
  connection: {
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.pass,
    database: config.mysql.db,
    charset: config.mysql.char
  }
});

var loginCheckMiddleware = function (req, res, next) {

  var skey = req.headers.skey;
  req.session = null;

  mysql(sessionTable).select('*').where({
    skey: skey
  })
    .then(function (result) {
      if (result.length > 0) {
        var session = result[0];
        var lastLoginTime = session.last_login_time;
        var expireTime = config.expireTime * 1000;

        if (moment(lastLoginTime, 'YYYY-MM-DD HH:mm:ss').valueOf() + expireTime > +new Date) {
          req.session = session;
        }
      }
      next();
    })
    .catch(function (e) {
      next();
    });

};

module.exports = {
  mysql: mysql,
  loginCheckMiddleware: loginCheckMiddleware
};