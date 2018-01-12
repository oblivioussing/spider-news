const express = require('express');
const router = express.Router();
const spiderResult = require('../base/result').spiderResult;
const qq = require('./qqNews');
const qqNews = qq.spiderInit;
const qqVideoUrl = qq.qqVideoUrl;
const sohuNews = require('./sohuNews');
const sinaNews = require('./sinaNews');
const weixinNews = require('./weixinNews');

//腾讯新闻
router.get('/qqNews', (req, res, next) => {
  judge(req.query, res, qqNews);
});
router.post('/qqNews', (req, res, next) => {
  judge(req.body, res, qqNews);
});
//腾讯视频
router.get('/refreshQQVideo',(req,res,next)=>{
  valiUrl(req.query,res,qqVideoUrl);
});
router.post('/refreshQQVideo',(req,res,next)=>{
  valiUrl(req.body,res,qqVideoUrl);
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
    staticBasePath: spiderResult.basePathNotNull,
    mCode: spiderResult.mCodeNotNull
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
//验证url是否为空
const valiUrl = async(req, res, method)=>{
  const url = req.url;
  if(url){
    const result = await method(url);
    res.send(result);
  }else{
    res.send(spiderResult.urlNotNull);
  }
}

module.exports = router;