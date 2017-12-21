var express = require('express');
var router = express.Router();
var dic = require('../base/dictionary');
var qqNews = require('./qqNews');
var sohuNews = require('./sohuNews');
var sinaNews = require('./sinaNews');
var weixinNews = require('./weixinNews');

//腾讯新闻
router.post('/qqNews', (req, res, next) => {
  judge(req, res, qqNews);
});
//搜狐新闻
router.post('/sohuNews', (req, res, next) => {
  judge(req, res, sohuNews);
});
//新浪新闻
router.post('/sinaNews', (req, res, next) => {
  judge(req, res, sinaNews);
});
//微信新闻
router.post('/weixinNews', (req, res, next) => {
  judge(req, res, weixinNews);
});

//审判
var judge = async(req, res, method) => {
  const body = req.body;
  let { url } = body;
  if (url) {
    const result = await method(body);
    res.send(result);
  } else {
    res.send({ resultCode: dic.authFail, msg: 'url不能为空!' });
  }
}


module.exports = router;