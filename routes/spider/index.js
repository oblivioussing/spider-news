var express = require('express');
var router = express.Router();
var dic = require('../base/dictionary');
var qqNews = require('./qqNews');
var sohuNews = require('./sohuNews');
var sinaNews = require('./sinaNews');
var weixinNews = require('./weixinNews');

//腾讯新闻
router.get('/qqNews', (req, res, next) => {
  judge(req.query, res, qqNews);
});
router.post('/qqNews', (req, res, next) => {
  console.log(req.body);
  judge(req.body, res, qqNews);
});
//搜狐新闻
router.get('/sohuNews', (req, res, next) => {
  judge(req.query, res, sohuNews);
});
router.post('/sohuNews', (req, res, next) => {
  judge(req.body, res, sohuNews);
});
//新浪新闻
router.get('/sinaNews', (req, res, next) => {
  judge(req.query, res, sinaNews);
});
router.post('/sinaNews', (req, res, next) => {
  judge(req.body, res, sinaNews);
});
//微信新闻
router.get('/weixinNews', (req, res, next) => {
  judge(req.query, res, weixinNews);
});
router.post('/weixinNews', (req, res, next) => {
  judge(req.body, res, weixinNews);
});


//审判
var judge = async(req, res, method) => {
  console.log(req);
  let { url } = req;
  if (url) {
    const result = await method(req);
    res.send(result);
  } else {
    res.send({ resultCode: dic.authFail, msg: 'url不能为空!' });
  }
}


module.exports = router;