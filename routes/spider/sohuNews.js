var puppeteer = require('puppeteer');
var devices = require('puppeteer/DeviceDescriptors');
var iPhone = devices['iPhone 6'];
var cheerio = require('cheerio');
var request = require('request');
var main = require('../base/main');
var spiderResult = require('../base/result').spiderResult;
//爬虫初始化
const spiderInit = (req) => {
  let { url, articleCode, staticBaseUrl, staticBasePath } = req;
  let $;
  //文章目录
  const articlePath = `${staticBasePath}/article/${articleCode}`;
  return new Promise(async(resolve, reject) => {
    //创建puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.emulate(iPhone);
    await page.setExtraHTTPHeaders(main.ua);
    await page.goto(url);
    //模拟点击事件
    await page.waitForSelector('.at-cnt-rest');
    await page.click('.at-cnt-rest');
    //创建文章目录
    main.mkArticlePath(articlePath);
    //获取头图
    await page.waitFor(500);
    const minipic = await main.getMinipic(page, '.imgforhtml>img');
    //获取页面所有内容 
    const html = await page.$eval('html', el => el.outerHTML);
    $ = cheerio.load(html, { decodeEntities: false });
    //返回结果
    let title = $('.at-head .at-title').html();
    const resultData = {
      minipic: minipic ? `article/${articleCode}/minipic.png` : '',
      title: title,
      desc: title
    }
    const result = Object.assign(spiderResult.success,{resultData});
    resolve(result);
    //下载头图
    minipic && main.downMinipic(minipic, articlePath);
    //去除部分原文章资源
    removeAsset($);
    //下载图片 
    await main.downImg($, articlePath, staticBaseUrl, articleCode);
    //添加自己的广告
    main.advert($, '.at-content');
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
    if (src) {
      src.indexOf('common.js') >= 0 && $(item).remove();
    }
  });
  $('.ui-recommend-mod').remove();
  $('.ui-comment-mod').remove();
  $('.ui-card-from').remove();
  $('.ui-activity-float').remove();
  $('.ui-top-article').remove();
}

module.exports = spiderInit;