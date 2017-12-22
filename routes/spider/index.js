var express = require('express');
var router = express.Router();
var spiderResult = require('../base/result').spiderResult;
var qqNews = require('./qqNews');
var sohuNews = require('./sohuNews');
var sinaNews = require('./sinaNews');
var weixinNews = require('./weixinNews');

//腾讯新闻
router.get('/qqNews', (req, res, next) => {
  judge(req.query, res, qqNews);
});
router.post('/qqNews', (req, res, next) => {
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


//验证参数是否为空
const judge = async(req, res, method) => {
  let verifyMap = {
    url: spiderResult.urlNotNull,
    articleCode: spiderResult.acNotNull,
    staticBaseUrl: spiderResult.baseUrlNotNull,
    staticBasePath: spiderResult.basePathNotNull
  }
  let result;
  for (let item in req) {
    if (!req[item] && verifyMap[item]) {
      result = verifyMap[item];
      break;
    }
  }
  if (result) {
    res.send(result);
  } else {
    result = await method(req);
    res.send(result);
  }
}


module.exports = router;