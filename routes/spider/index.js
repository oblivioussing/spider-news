var express = require('express');
var router = express.Router();
var qqNews = require('./qqNews');
var sohuNews = require('./sohuNews');
var sinaNews = require('./sinaNews');
var sohuweixinNews = require('./sohuweixinNews');

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
//搜狐微信
router.post('/sohuweixinNews', (req, res, next) => {
  judge(req, res, sohuweixinNews);
});

//审判
var judge = async(req, res, method) => {
  const url = req.body.url;
  const articleCode = req.body.articleCode;
  if (url) {
    const result = await method({ url, articleCode });
    res.send(result);
  } else {
    res.send({ 'msg': 'url不能为空!' });
  }
}


module.exports = router;