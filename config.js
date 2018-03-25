module.exports = {
  port: 5757,
  //过期时间，秒
  expireTime: 24 * 3600,
  appid: 'your app id',
  secret: 'you secret',
  mysql: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    db: 'todo',
    pass: 'todo1234',
    char: 'utf8mb4'
  },
  //文件云存储
  cos: {
    region: 'ap-guangzhou',
    fileBucket: 'todo'
  }
};