const cheerio = require('cheerio');
const request = require('request');
const main = require('../base/main');
const dic = require('../base/dic');
const spiderResult = require('../base/result').spiderResult;
//爬虫初始化
const spiderInit = (req) => {
  let { url, articleCode, staticBaseUrl, staticBasePath, mCode } = req;
  let $;
  //文章目录
  const articlePath = `${staticBasePath}/article/${articleCode}`;
  return new Promise(async (resolve, reject) => {
    //创建puppeteer
    const { browser, page } = await main.initPuppeteer(url);
    try {
      await page.waitForSelector('._3em8Ej2zWZAW8Nj3xKSF9c', { visible: true, timeout: 2000 });
      await page.click('._3em8Ej2zWZAW8Nj3xKSF9c');
    } catch (e) {
      console.log(e);
    }
    //创建文章目录
    main.mkArticlePath(articlePath);
    //获取头图
    await page.waitForSelector('._2pXgak5v8oUN3AADfbu6QU', { visible: true, timeout: 10000 });
    const minipic = await main.getMinipic(page, '._2pXgak5v8oUN3AADfbu6QU');
    //获取页面所有内容 
    const html = await page.$eval('html', el => el.outerHTML);
    $ = cheerio.load(html, { decodeEntities: false });
    //返回结果
    let title = '';
    $('._1PgoakIM6yoElVvNmFVyaK>span').each((index, item) => {
      title += $(item).html();
    });
    //文章是否有视频
    let hasVideo = '';
    $('script').each((index, item) => {
      let src = $(item).attr('src');
      if (src && src.indexOf('video') >= 0) {
        hasVideo = dic.qqVideoType;
      }
    });
    const resultData = {
      minipic: minipic ? `article/${articleCode}/minipic.png` : '',
      title: title,
      desc: title,
      hasVideo: hasVideo
    }
    const result = Object.assign(spiderResult.success, { resultData });
    resolve(result);
    //下载头图
    minipic && main.downMinipic(minipic, articlePath);
    //去除部分原文章资源
    removeAsset($);
    //下载图片 
    await main.downImg($, articlePath, staticBaseUrl, articleCode);
    //添加自己的广告和资源引用
    main.advert($, '#root', staticBaseUrl, mCode);
    //获取视频地址并添加到文章中
    const videoUrl = await main.getVideoUrl('.txp_shadow', page);
    if (videoUrl) {
      $('.VbfvcnFQEGQAtVi3h2QEM').css('margin-top', '90px');
      main.insertVideo('._30BC5qV5yH-iDB9Pt290gj>div', $, videoUrl);
    }
    //写入html
    main.saveHtml($, articlePath);
    //关闭浏览器
    await browser.close();
  });
};
//去除部分原文章资源
const removeAsset = ($) => {
  $('script').each((index, item) => {
    let src = $(item).attr('src');
    if (src) {
      src.indexOf('main') >= 0 && $(item).remove();
    }
  });
  $('._3ggQez72YVSmfcfD8kd7M9').remove();
}
//获取腾讯视频地址
const qqVideoUrl = (url) => {
  return new Promise(async (resolve, reject) => {
    //创建puppeteer
    const { browser, page } = await main.initPuppeteer(url);
    //获取视频地址并添加到文章中
    const videoUrl = await main.getVideoUrl('.txp_shadow', page);
    if (videoUrl) {
      const result = Object.assign(spiderResult.success, { resultData: { url: videoUrl } });
      resolve(result);
    } else {
      resolve(spiderResult.videoUrlNull);
    }
    //关闭浏览器
    await browser.close();
  });
}

module.exports = { spiderInit, qqVideoUrl };