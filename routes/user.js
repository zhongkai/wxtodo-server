const express = require('express');
const router = express.Router();

router.get('/login', (req, res, next) => {
    let code = req.query.code

    request.get({
        uri: 'https://api.weixin.qq.com/sns/jscode2session',
        json: true,
        qs: {
            grant_type: 'authorization_code',
            appid: '你小程序的APPID',
            secret: '你小程序的SECRET',
            js_code: code
        }
    }, (err, response, data) => {
        if (response.statusCode === 200) {
            console.log("[openid]", data.openid)
            console.log("[session_key]", data.session_key)

            //TODO: 生成一个唯一字符串sessionid作为键，将openid和session_key作为值，存入redis，超时时间设置为2小时
            //伪代码: redisStore.set(sessionid, openid + session_key, 7200)

            res.json({ sessionid: sessionid })
        } else {
            console.log("[error]", err)
            res.json(err)
        }
    });

});

module.exports = router;
