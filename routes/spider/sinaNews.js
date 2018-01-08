const cheerio = require('cheerio');
const request = require('request');
const main = require('../base/main');
const spiderResult = require('../base/result').spiderResult;
//爬虫初始化
const spiderInit = (req) => {
  let { url, articleCode, staticBaseUrl, staticBasePath, mCode } = req;
  let $;
  //系统根目录
  const root = main.root;
  //文章目录
  const articlePath = `${staticBasePath}/article/${articleCode}`;
  return new Promise(async(resolve, reject) => {
    //创建puppeteer
    const { browser, page } = await main.initPuppeteer(url);
    //创建文章目录
    main.mkArticlePath(articlePath);
    //获取头图
    await page.waitForSelector('.art_img_mini_img', { visible: true, timeout: 10000 });
    const minipic = await main.getMinipic(page, '.art_img_mini_img');
    //获取页面所有内容 
    const html = await page.$eval('html', el => el.outerHTML);
    $ = cheerio.load(html, { decodeEntities: false });
    //返回结果
    let title = $('.art_box .art_tit_h1').html();
    const resultData = {
      minipic: minipic ? `article/${articleCode}/minipic.png` : '',
      title: title,
      desc: title
    }
    const result = Object.assign(spiderResult.success, { resultData });
    resolve(result);
    //下载头图
    minipic && main.downMinipic(minipic, articlePath);
    //去除部分原文章资源
    removeAsset($);
    //下载图片 
    await main.downImg($, articlePath, staticBaseUrl, articleCode);
    //添加自己的广告
    main.advert($, '.at-content', staticBaseUrl, mCode);
    //写入html
    main.saveHtml($, articlePath);
    //关闭浏览器
    await browser.close();
  });
};
//去除部分原文章资源
var removeAsset = ($) => {
  $('.page_main').children().not('.s_card.z_c1').remove();
}

module.exports = spiderInit;