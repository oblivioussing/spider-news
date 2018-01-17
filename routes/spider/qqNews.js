const cheerio = require('cheerio');
const request = require('request');
const main = require('../base/main');
const dic = require('../base/dic');
const spiderResult = require('../base/result').spiderResult;
//爬虫初始化
const spiderInit = (req) => {
  let { url, articleCode, staticBaseUrl, staticBasePath, articleContentPath, mCode, articleName } = req;
  let $;
  //文章目录
  const articlePath = `${staticBasePath}${articleContentPath}/${articleCode}`;
  return new Promise(async (resolve, reject) => {
    //创建puppeteer
    const { browser, page } = await main.initPuppeteer(url);
    try {
      await page.waitForSelector('._1fdJgE9col8hzvfrzqK_ig', { visible: true, timeout: 2000 });
      await page.waitFor(300);
      await page.click('._1fdJgE9col8hzvfrzqK_ig');
    } catch (e) {
      console.log('查看全文按钮不存在');
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
    //获取视频地址
    const videoUrl = hasVideo && await main.getVideoUrl('.txp_shadow', page);
    const resultData = {
      miniPic: minipic ? `${articleContentPath}/${articleCode}/minipic.png` : '',
      title: title,
      desc: title,
      hasVideo: hasVideo,
      url: videoUrl || ''
    }
    const result = Object.assign(spiderResult.success, { resultData });
    resolve(result);
    //下载头图
    minipic && main.downMinipic(minipic, articlePath);
    //去除部分原文章资源
    removeAsset($);
    //下载图片 
    const contentCodePath = articleContentPath + '/' + articleCode;
    await main.downImg($, articlePath, staticBaseUrl, contentCodePath);
    //添加自己的广告和资源引用
    main.advert($, '#root', staticBaseUrl, mCode);
    //写入html
    main.saveHtml($, articlePath, articleName);
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
  $('._16fUG4H0ZbiY3-cmG3DXES').remove();
  $('._4l9HCryiEbUHtuIiH7iz').remove();
  $('._3ggQez72YVSmfcfD8kd7M9').remove();
}
//获取腾讯视频地址
const refreshQQVideo = (url) => {
  return new Promise(async (resolve, reject) => {
    //创建puppeteer
    const { browser, page } = await main.initPuppeteer(url);
    //获取视频地址并添加到文章中
    const videoUrl = await main.getVideoUrl('.txp_shadow', page);
    if (videoUrl) {
      const result = Object.assign(spiderResult.videoSuccess, { resultData: { url: videoUrl } });
      resolve(result);
    } else {
      resolve(spiderResult.videoUrlNull);
    }
    //关闭浏览器
    await browser.close();
  });
}


module.exports = { spiderInit, refreshQQVideo };