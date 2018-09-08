var express = require('express');
var router = express.Router();
var loginCheckMiddleware = require('../util').loginCheckMiddleware;
var mysql = require('../util').mysql;
var only = require('../util').only;
var todoTable = 'todo';
var todoAttrs = 'content status tag1 tag2 tag3 extra';

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
      res.json(result.map(function(item) {
        delete item.open_id;
        return item;
      }));
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
        if (result[0].open_id != req.session.open_id) {
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

  todo.tags = todo.tags || [];

  todo = {
    open_id: req.session.open_id,
    content: todo.content,
    tag1: todo.tags[0] || '',
    tag2: todo.tags[1] || '',
    tag3: todo.tags[2] || '',
    extra: todo.extra || ''
  };
  

  mysql(todoTable).insert(todo)
    .then(function (result) {
      todo.id = result[0];
      delete todo.open_id;
      res.json(todo);
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
        if (result[0].open_id != req.session.open_id) {
          res.status(403).json({
            error: '无权操作该todo'
          });
        }
        else {
          mysql(todoTable).where({
            id: req.params.id
          })
            .delete()
            .then(function() {
              res.status(204).json({});
            });
        }
      }
    });

});

// 局部更新todo
// router.patch('/:id', function (req, res, next) {
router.put('/:id', function (req, res, next) {

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
        if (result[0].open_id != req.session.open_id) {
          res.status(403).json({
            error: '无权操作该todo'
          });
        }
        else {
          var changedAttrs = only(req.body, todoAttrs);
          if (req.body.tags && req.body.tags.length) {
            changedAttrs.tag1 = req.body.tags[0] || '';
            changedAttrs.tag2 = req.body.tags[1] || '';
            changedAttrs.tag3 = req.body.tags[2] || '';
          }
          mysql(todoTable).where({
            id: req.params.id
          })
            .update(changedAttrs)
            .then(function () {
              res.json(changedAttrs);
            });
        }
      }
    });

});

// 批量操作
router.post('/batch', function(req, res, next) {

  var body = req.body;
  var action = body.action;
  var items = body.items;

  if(!items.length || ['create', 'update', 'delete'].indexOf(action) < 0) {
    res.status(400).json({
      error: '参数错误'
    });
    return;
  }

  if(action == 'create') {

    items = item.map(function(todo) {
      todo.tags = todo.tags || [];
      return {
        open_id: req.session.open_id,
        content: todo.content,
        tag1: todo.tags[0] || '',
        tag2: todo.tags[1] || '',
        tag3: todo.tags[2] || '',
        extra: todo.extra || ''
      };
    });

    mysql(todoTable).insert(items)
      .then(function (result) {
        res.json(result);
      });

    return;
  }


  if(action == 'delete') {

    mysql(todoTable).where({
        open_id: req.session.open_id
      })
      .whereIn('id', items)
      .delete()
      .then(function (result) {
        res.json(result);
      });
    
    return;

  }

  if(action == 'update') {

    if (!body.attrs) {
      res.status(400).json({
        error: '参数错误'
      });
      return;
    }

    mysql(todoTable).where({
        open_id: req.session.open_id
      })
      .whereIn('id', items)
      .update(only(body.attrs, todoAttrs))
      .then(function (result) {
        res.json(result);
      });

    return;
    
  }

});

module.exports = router;