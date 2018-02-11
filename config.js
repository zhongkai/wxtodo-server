module.exports = {
  port: 5757,
  //过期时间，秒
  expireTime: 24 * 3600,
  appid: 'wxd8236db661b94c82',
  secret: '1469e5f70903103d324bea57d4be409d',
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
    fileBucket: 'todo',
    regionMap: {
      'ap-beijing-1': 'tj',
      'ap-beijing': 'bj',
      'ap-shanghai': 'sh',
      'ap-guangzhou': 'gz',
      'ap-chengdu': 'cd',
      'ap-singapore': 'sgp',
      'ap-hongkong': 'hk',
      'na-toronto': 'ca',
      'eu-frankfurt': 'ger'
    }
  }
};