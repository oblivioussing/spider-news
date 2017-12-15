var express = require('express');
var news = require('./news');
var router = express.Router();

//抓取文章
router.post('/news', async(req, res, next) => {
  const result = await news(req.body);
  res.send(result);
});


module.exports = router;