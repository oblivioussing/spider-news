var express = require('express');
var qqNews = require('./qqNews');
var router = express.Router();

//腾讯新闻
router.post('/qqNews', async(req, res, next) => {
  const url = req.body.url;
  const articleCode = req.body.articleCode;
  if (url) {
    const result = await qqNews({ url, articleCode });
    res.send(result);
  } else {
    res.send({ 'msg': 'url不能为空!' });
  }
});


module.exports = router;