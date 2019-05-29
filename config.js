module.exports = {
  port: 5757,
  //过期时间，秒
  expireTime: 24 * 3600,
  appid: '****************',
  secret: '*****************',
  mysql: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    db: 'todo',
    pass: '**********',
    char: 'utf8mb4'
  },
  //文件云存储
  cos: {
    region: 'ap-guangzhou',
    fileBucket: 'todo'
  }
};