const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
const http = require('http');
const https = require('https');
const request = require('request');
const core = require('../base/core');
const root = 'D:/Project/node/spider-news'
let $;

//爬虫初始化
const spiderInit = (req) => {
  return new Promise(async(resolve, reject) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36' })
    await page.goto(req.url);
    //模拟点击事件
    await page.click('._3kfd8QSnqfsnaXmIaniUI3');
    //选择头图
    let coverUrl = await ascend(page);
    //保存头图
    coverUrl && saveCover(coverUrl);
    //获取页面所有内容
    const html = await page.$eval('html', el => el.outerHTML);
    $ = cheerio.load(html, { decodeEntities: false });
    //去除css和script外部引用
    removeAsset();
    //抓取图片 
    await saveImg();
    //移除最底部的按钮
    $('._3J9LS0hE611NF98iLoPe9P').remove();
    $('.Q-R81yIZjT-MUA5SNBANp').remove();
    //添加自己的广告
    advert();
    //写入html
    fs.writeFileSync(`${root}/reserve/html/test.html`, $.html());
    //关闭浏览器
    await browser.close();
    //返回
    let title = '';
    $('._2poZ855aoGVenxcOnR5VXw>span').each((index, item) => {
      title += $(item).html();
    });
    const result = {
      title: title,
      desc: title,
      minipic: '脑壳疼',
      url: '心肝疼'
    }
    resolve(result);
  });
};

//保存头图
const saveCover = (coverUrl) => {
  request(coverUrl).pipe(fs.createWriteStream(`${root}/reserve/cover/cover.png`));
}
//选择头图
const ascend = async(page) => {
  return new Promise(async(resolve, reject) => {
    const url = await page.$$eval('img', el => {
      let src;
      for (let i = 0; i < el.length; i++) {
        const width = el[i].offsetWidth;
        const height = el[i].offsetHeight;
        if (width >= 300 && 0.5 < width / height < 2) {
          src = el[i].getAttribute('src');
          break;
        }
      }
      return src;
    });
    resolve(url);
  });
}
//添加自己的广告
const advert = () => {
  let img, script, link;
  img = '<img src="./" class="full-screen none" alt="">'; //全屏图片
  img += '<img src="../asset/img/loading.svg" class="gravity-center advert-loading">'; //加载loading
  img += '<img src="../asset/img/bottom-fixed.jpg" class="bottom-fixed none" alt="">'; //底部固定的图片
  script = '<script src="../asset/js/zepto.min.js"></script>'; //引入zepto
  script += '<script src="../asset/js/index.js"></script>'; //引入自己的js
  link = '<link href="../asset/css/index.css" rel="stylesheet" type="text/css" />'; //引入自己的css
  let rootBottom = '<div class="root-bottom"><img src="../asset/img/bottom.jpg" alt=""></div>'; //最底部的图片
  $('body').prepend(img);
  $('head').append(script + link);
  $('#root').append(rootBottom);
}
//去除css和script外部引用
const removeAsset = () => {
  $('link').each((index, item) => {
    const href = $(item).attr('href');
    href && $(item).remove();
  });
  $('script').each((index, item) => {
    const src = $(item).attr('src');
    src && $(item).remove();
  });
}
//抓取图片
const saveImg = async() => {
  return new Promise(async(resolve, reject) => {
    const len = $('img').length;
    for (let i = 0; i < len; i++) {
      await core.sleep(10);
      const src = $('img').eq(i).attr('src');
      if (src.indexOf('http') === 0) {
        //保存图片
        const stamp = +new Date();
        request(src).pipe(fs.createWriteStream(`${root}/reserve/img/${stamp}.png`));
        $('img').eq(i).attr('src', `../img/${stamp}.png`);
      }
    }
    resolve();
  });
}

module.exports = spiderInit;