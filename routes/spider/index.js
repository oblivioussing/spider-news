var express = require('express');
var news = require('./news');
const core = require('../base/core');
const test = require('./test');
const puppeteer = require('puppeteer');
var router = express.Router();

//抓取文章
router.post('/news', async(req, res, next) => {
  const result = await news(req.body);
  res.send(result);
});

router.post('/test', async(req, res, next) => {
  const obj = await test(req.body);
  res.send(obj);
});


module.exports = router;