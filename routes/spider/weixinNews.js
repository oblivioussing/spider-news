var puppeteer = require('puppeteer');
var devices = require('puppeteer/DeviceDescriptors');
var iPhone = devices['iPhone 6'];
var cheerio = require('cheerio');
var request = require('request');
var main = require('../base/main');
//爬虫初始化
const spiderInit = (req) => {
  const url = req.url;
  const articleCode = req.articleCode;
  let $;
  //系统根目录
  const root = main.root;
  //文章目录
  const articlePath = `${root}/article/${articleCode}`;
  return new Promise(async(resolve, reject) => {
    //创建puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.emulate(iPhone);
    await page.setExtraHTTPHeaders(main.ua);
    await page.goto(url);
    //创建文章目录
    main.mkArticlePath(articlePath);
    //获取头图
    await page.waitFor(1000);
    const minipic = await main.getMinipic(page, 'img');
    //获取页面所有内容 
    const html = await page.$eval('html', el => el.outerHTML);
    $ = cheerio.load(html, { decodeEntities: false });
    //返回结果
    let title = $('.rich_media_title').html().trim();
    const resultCode = dic.success;
    const resultData = {
      minipic: minipic ? `article/${articleCode}/minipic.png` : '',
      title: title,
      desc: title
    }
    resolve({ resultCode, resultData });
    //下载头图
    minipic && main.downMinipic(minipic, articlePath);
    //去除部分原文章资源
    removeAsset($);
    //下载图片 
    await main.downImg($, articlePath, staticBaseUrl, articleCode);
    //添加自己的广告
    main.advert($, '.rich_media_content');
    //写入html
    main.saveHtml($, articlePath);
    //关闭浏览器
    await browser.close();
  });
};
//去除部分原文章资源
var removeAsset = ($) => {
  $('script').each((index, item) => {
    let src = $(item).attr('src');
    if(src){
      src.indexOf('main')>=0 && $(item).remove();
    }
  });
}

module.exports = spiderInit;