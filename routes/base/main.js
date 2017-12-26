var fs = require('fs');
var request = require('request');
var core = require('./core');

module.exports = {
  //user-agent
  ua: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; MI 4LTE Build/MMB29M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/46.0.2490.76 Mobile Safari/537.36' },
  //应该返回的结果集
  result: {
    resultCode: '', //业务响应码
    resultData: {}, //返回数据对象
    resultMsg: '' //业务响应描述
  },
  //创建文章目录
  mkArticlePath: (path) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path); //文章目录
      fs.mkdirSync(path + '/img'); //图片目录
    }
  },
  //获取头图
  getMinipic: (page, img) => {
    return new Promise(async(resolve, reject) => {
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
    return new Promise(async(resolve, reject) => {
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
          $('img').eq(i).attr('src', `/${baseUrl}/article/${articleCode}/img/${stamp}.jpg`);
        }
      }
      resolve();
    });
  },
  //添加自己的广告
  advert: ($, el, baseUrl) => {
    let img, script, link;
    img = '<img src="./" class="full-screen none" alt="">'; //全屏图片
    img += `<img src="${baseUrl}/article_asset/img/loading.svg" class="gravity-center advert-loading">`; //加载loading
    img += `<img src="${baseUrl}/article_asset/img/bottom-fixed.jpg" class="bottom-fixed none" alt="">`; //底部固定的图片
    script = `<script src="${baseUrl}/article_asset/js/zepto.min.js"></script>`; //引入zepto
    script += `<script src="${baseUrl}/article_asset/js/index.js"></script>`; //引入自己的js
    link = `<link href="${baseUrl}/article_asset/css/index.css" rel="stylesheet" type="text/css" />`; //引入自己的css
    let rootBottom = `<div class="root-bottom"><img src="${baseUrl}/article_asset/img/bottom.jpg" alt=""></div>`; //最底部的图片
    $('body').prepend(img);
    $('head').append(script + link);
    $(el).append(rootBottom);
  },
  //写入html
  saveHtml: ($, path) => {
    fs.writeFileSync(`${path}/index.html`, $.html());
  }
}