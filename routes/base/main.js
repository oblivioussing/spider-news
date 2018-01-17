const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];
const fs = require('fs');
const request = require('request');
const core = require('./core');
module.exports = {
  //创建puppeteer实例
  initPuppeteer: (url) => {
    return new Promise(async (resolve, rejct) => {
      const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();
      await page.emulate(iPhone);
      await page.goto(url);
      resolve({ browser, page });
    });
  },
  //创建文章目录
  mkArticlePath: (path) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path); //文章目录
    }
    if(!fs.existsSync(path+'/img')){
      fs.mkdirSync(path + '/img'); //图片目录
    }
  },
  //获取头图
  getMinipic: (page, img) => {
    return new Promise(async (resolve, reject) => {
      const url = await page.$$eval(img, el => {
        let src;
        for (let i = 0; i < el.length; i++) {
          const width = el[i].clientWidth || '';
          const height = el[i].height || '';
          const ratio = width / height;
          if (ratio && width >= 300 && 0.5 < ratio && ratio < 2) {
            let dataSrc = el[i].getAttribute('data-src');
            src = dataSrc ? dataSrc : el[i].getAttribute('src');
            break;
          }
        }
        return src;
      });
      resolve(url);
    });
  },
  //下载头图
  downMinipic: (url, path, http = 'https:') => {
    if (url.indexOf('http') === 0 || url.indexOf('//') === 0) {
      url = url.indexOf('http') < 0 ? http + url : url;
      request(url).pipe(fs.createWriteStream(`${path}/minipic.jpg`));
    }
  },
  //下载图片
  downImg: ($, path, baseUrl, articleCode, http = 'https:') => {
    return new Promise(async (resolve, reject) => {
      const len = $('img').length;
      for (let i = 0; i < len; i++) {
        await core.sleep(10);
        let src = $('img').eq(i).attr('src') || ' ';
        let dataSrc = $('img').eq(i).attr('data-src');
        if (src.indexOf('http') === 0 || src.indexOf('//') === 0 || dataSrc) {
          src = src.indexOf('http') < 0 ? http + src : src;
          src = dataSrc ? dataSrc : src;
          //保存图片
          const stamp = +new Date();
          request(src).pipe(fs.createWriteStream(`${path}/img/${stamp}.jpg`));
          $('img').eq(i).attr('src', `${baseUrl}/article/${articleCode}/img/${stamp}.jpg`);
        }
      }
      resolve();
    });
  },
  //添加自己的广告和资源引用
  advert: ($, el, baseUrl, mCode) => {
    let img, script, link;
    link = `<link href="${baseUrl}/article_asset/css/index.css" rel="stylesheet" type="text/css" />`; //引入自己的css
    link += `<link href="${baseUrl}/article_asset/css/video-js.css" rel="stylesheet" type="text/css" />`; //引入videojs.css
    script = `<script src="${baseUrl}/article_asset/js/zepto.min.js"></script>`; //引入zepto
    script += `<script src="${baseUrl}/article_asset/js/index.js"></script>`; //引入自己的js
    script += `<script src="${baseUrl}/article_asset/js/video.js"></script>`; //引入自己的videojs
    img = `<div class="full-screen none" mCode="${mCode}"></div>`; //全屏图片
    img += `<img src="${baseUrl}/article_asset/img/loading.svg" class="gravity-center advert-loading" />`; //加载loading
    img += `<img src="${baseUrl}/article_asset/img/bottom-fixed.jpg" class="bottom-fixed none" alt="" />`; //底部固定的图片
    let rootBottom = `<div class="root-bottom"><img src="${baseUrl}/article_asset/img/bottom.jpg" alt=""></div>`; //最底部的图片
    $('body').prepend(img);
    $('head').append(link + script);
    $(el).append(rootBottom);
  },
  //获取视频地址
  getVideoUrl: (el, page) => {
    return new Promise(async (resolve, reject) => {
      try {
        await page.waitForSelector(el, { visible: true, timeout: 3000 });
        await page.click(el);
        const videoUrl = await page.evaluate(() => {
          return new Promise((resolve, reject) => {
            const video = document.querySelector('video');
            video.addEventListener('error', e => {
              resolve(e.target.currentSrc);
            });
          });
        });
        resolve(videoUrl);
      } catch (e) {
        console.log(e);
      }
    });
  },
  //插入视频
  insertVideo: (el, $, url) => {
    const temp = `<video id="myVideo" class="video-js vjs-big-play-centered" controls preload="auto" style="width: 100%;height:264px;" data-setup="{}">
                  <source src="${url}">
                </video>`;
    $(el).append(temp);
  },
  //写入html
  saveHtml: ($, path) => {
    fs.writeFileSync(`${path}/index.html`, $.html());
  }
}