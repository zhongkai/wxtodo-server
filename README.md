# wxtodo-server

这是结合腾讯云开发小程序的Server端代码.

需结合[小程序客户端代码](https://github.com/zhongkai/wxtodo-client)的online分支使用。

目录结构：

```
小程序项目
|-- wxtodo-client（online分支）
|-- wxtodo-server（master分支）
|-- project.config.json
```

project.config.json配置为：

```json
{
	"client": "./wxtodo-client",
	"qcloudRoot": "./wxtodo-server",
	"setting": {
		"urlCheck": true,
		"es6": false,
		"postcss": true,
		"minified": true,
		"newFeature": true
	},
	"appid": "your appid",
	"projectname": "you project name",
	"condition": {}
}
```

练习使用Server端代码时，请根据教学视频，配置`config.js`文件，初始化数据库和COS服务。