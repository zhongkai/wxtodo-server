var express = require('express');
var router = express.Router();
var loginCheckMiddleware = require('../util').loginCheckMiddleware;
var mysqal = require('../util').mysql;
var todoTable = 'todo';

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

// 获取当前用户所有todos
router.get('/', function (req, res, next) {

  mysql(todoTable).where({
    open_id: req.session.open_id
  })
    .select('*')
    .then(function (result) {
      res.json(result);
    });

});

// 获取当前用户指定todo
router.get('/:id', function (req, res, next) {

  mysql(todoTable).where({
    id: req.params.id
  })
    .select('*')
    .then(function (result) {
      if (result.length === 0) {
        res.status(404).json({
          error: 'todo不存在'
        });
      }
      else {
        if (result[0].open_id != req.params.id) {
          res.status(403).json({
            error: '无权查看该todo'
          });
        }
        else {
          res.json(result[0]);
        }
      }
    });

});

//添加todo
router.post('/', function (req, res, next) {

  var todo = req.body;

  if(!todo.content) {
    res.status(400).json({
      error: '参数错误'
    });
    return;
  }

  mysql(todoTable).insert({
    open_id: req.session.open_id,
    content: todo.content,
    tag1: todo.tags[0] || '',
    tag2: todo.tags[1] || '',
    tag3: todo.tags[2] || '',
    extra: todo.extra || ''
  })
    .then(function (result) {
      res.json(result);
    });

});

// 删除指定todo
router.delete('/:id', function (req, res, next) {

  mysql(todoTable).where({
    id: req.params.id
  })
    .select('*')
    .then(function (result) {
      if (result.length === 0) {
        res.status(404).json({
          error: 'todo不存在'
        });
      }
      else {
        if (result[0].open_id != req.params.id) {
          res.status(403).json({
            error: '无权查看该todo'
          });
        }
        else {
          mysql(todoTable).where({
            id: req.params.id
          })
            .delete()
            .then(function() {
              res.json(result[0]);
            });
        }
      }
    });

});

// 删除所有已完成的todo
router.delete('/', function() {

  var clearStatus = req.query.status;

  if ([0, 1].indexOf(clearStatus) < 0) {
    res.status(400).json({
      error: '参数错误'
    })
  }
  else {
    mysql(todoTable).where({
      open_id: req.session.open_id,
      status: clearStatus
    })
    .then(function(result) {
      //todo
      res.json(result);
    });
  }

});

module.exports = router;