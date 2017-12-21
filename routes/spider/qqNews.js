var puppeteer = require('puppeteer');
var devices = require('puppeteer/DeviceDescriptors');
var iPhone = devices['iPhone 6'];
var cheerio = require('cheerio');
var request = require('request');
var main = require('../base/main');
var dic = require('../base/dictionary');
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
    try{
      await page.waitForSelector('._3em8Ej2zWZAW8Nj3xKSF9c', { visible: true, timeout: 2000 });
      await page.click('._3em8Ej2zWZAW8Nj3xKSF9c');
    }catch(e){
      console.log(e);
    }
    //创建文章目录
    main.mkArticlePath(articlePath);
    //获取头图
    await page.waitFor(500);
    const minipic = await main.getMinipic(page, '._2pXgak5v8oUN3AADfbu6QU');
    //获取页面所有内容 
    const html = await page.$eval('html', el => el.outerHTML);
    $ = cheerio.load(html, { decodeEntities: false });
    //返回结果
    let title = '';
    $('._1PgoakIM6yoElVvNmFVyaK>span').each((index, item) => {
      title += $(item).html();
    });
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
    //移除最底部的按钮
    $('._3ggQez72YVSmfcfD8kd7M9').remove();
    //下载图片 
    await main.downImg($, articlePath, staticBaseUrl, articleCode);
    //添加自己的广告
    main.advert($, '#root', staticBaseUrl);
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
      src.indexOf('main') >= 0 && $(item).remove();
    }
  });
}

module.exports = spiderInit;