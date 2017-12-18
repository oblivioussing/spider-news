var puppeteer = require('puppeteer');
var cheerio = require('cheerio');
var request = require('request');
var main = require('../base/main');
const moreBtn = '._3em8Ej2zWZAW8Nj3xKSF9c'; //点击查看全文按钮样式
//爬虫初始化
const spiderInit = (req) => {
  const url = req.url;
  const articleCode = req.articleCode;
  let $;
  //需要返回结果集
  let result = main.result;
  //系统根目录
  const root = main.root;
  //文章目录
  const articlePath = `${root}/article/${articleCode}`;
  return new Promise(async(resolve, reject) => {
    //创建puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders(main.ua);
    await page.goto(url);
    //模拟点击事件
    await page.waitForSelector(moreBtn);
    await page.click(moreBtn);
    //创建文章目录
    main.mkArticlePath(articlePath);
    //获取头图
    const minipic = await main.getMinipic(page, '._2pXgak5v8oUN3AADfbu6QU');
    result.minipic = minipic ? `${articlePath}/minipic.png` : '';
    //获取页面所有内容 
    const html = await page.$eval('html', el => el.outerHTML);
    $ = cheerio.load(html, { decodeEntities: false });
    //返回结果
    let title = '';
    $('._1PgoakIM6yoElVvNmFVyaK>span').each((index, item) => {
      title += $(item).html();
    });
    result.title = title;
    result.desc = title;
    result.url = `${articlePath}/index.html`;
    resolve(result);
    //下载头图
    minipic && main.downMinipic(minipic, articlePath);
    //去除main.fedf78ba.js引用(不然会导致页面白屏)
    removeAsset($);
    //下载图片 
    await main.downImg($, articlePath);
    //移除最底部的按钮
    $('._3ggQez72YVSmfcfD8kd7M9').remove();
    //添加自己的广告
    main.advert($, '#root');
    //写入html
    main.saveHtml(articlePath, $);
    //关闭浏览器
    await browser.close();
  });
};
//去除main.d83d8a5f.js引用(不然会导致页面白屏)
var removeAsset = ($) => {
  const mainJs = '//mat1.gtimg.com/pingjs/js/tnfe/works/news/main.fedf78ba.js';
  $('script').each((index, item) => {
    const src = $(item).attr('src');
    src === mainJs && $(item).remove();
  });
}

module.exports = spiderInit;