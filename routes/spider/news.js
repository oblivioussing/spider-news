const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
const http = require('http');
const https = require('https');
const request = require('request');
const core = require('../base/core');
const root = 'D:/Project/nodejs/spider-news'

//爬虫初始化
const spiderInit = (req) => {
  return new Promise(async(resolve, reject) => {
    const url = req.url;
    const articleCode = req.articleCode;
    !url && reject();
    let $;
    //文章目录
    let articlePath;
    //需要返回结果
    let result = {
      title: '', //标题
      desc: '', //描述
      minipic: '', //头图
      url: '' //文章地址
    }
    //创建puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36' })
    await page.goto(url);
    // // // //模拟点击事件
    await page.waitForSelector('._3em8Ej2zWZAW8Nj3xKSF9c');
    await page.click('._3em8Ej2zWZAW8Nj3xKSF9c');
    //根据文章id创建文件夹(如果存在则删除)
    articlePath = `${root}/article/${articleCode}`;
    if (!fs.existsSync(articlePath)) {
      fs.mkdirSync(articlePath); //文章目录
      fs.mkdirSync(articlePath + '/img'); //图片目录
      fs.mkdirSync(articlePath + '/minipic'); //头图目录
    }
    //获取并下载头图
    const minipic = await ascend(page);
    minipic && saveMinipic(minipic, articlePath);
    result.minipic = `${articlePath}/minipic/minipic.png`;
    //获取页面所有内容
    const html = await page.$eval('html', el => el.outerHTML);
    $ = cheerio.load(html, { decodeEntities: false });
    //去除main.fedf78ba.js引用(不然会导致页面白屏)
    removeAsset($);
    //抓取图片 
    await saveImg($,articlePath);
    //移除最底部的按钮
    $('._3J9LS0hE611NF98iLoPe9P').remove();
    $('.Q-R81yIZjT-MUA5SNBANp').remove();
    //添加自己的广告
    advert($);
    //写入html
    fs.writeFileSync(`${articlePath}/index.html`, $.html());
    //关闭浏览器
    await browser.close();
    //返回
    let title = '';
    $('._1PgoakIM6yoElVvNmFVyaK>span').each((index, item) => {
      title += $(item).html();
    });
    result.title = title;
    result.desc = title;
    result.url = `${articlePath}/index.html`;
    resolve(result);
  });
};

//保存头图
const saveMinipic = (minipic, articlePath) => {
  request(minipic).pipe(fs.createWriteStream(`${articlePath}/minipic/minipic.png`));
}
//选择头图
const ascend = async(page) => {
  return new Promise(async(resolve, reject) => {
    await page.mainFrame().waitFor('._2pXgak5v8oUN3AADfbu6QU');
    const url = await page.$$eval('._2pXgak5v8oUN3AADfbu6QU', el => {
      let src;
      for (let i = 0; i < el.length; i++) {
        const width = el[i].clientWidth || '';
        const height = el[i].height || '';
        const ratio = width / height;
        if (ratio && width >= 300 && 0.5 < ratio && ratio < 2) {
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
const advert = ($) => {
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
//去除main.d83d8a5f.js引用(不然会导致页面白屏)
const removeAsset = ($) => {
  const mainJs = '//mat1.gtimg.com/pingjs/js/tnfe/works/news/main.fedf78ba.js';
  $('script').each((index, item) => {
    const src = $(item).attr('src');
    src === mainJs && $(item).remove();
  });
}
//抓取图片
const saveImg = async($,articlePath) => {
  return new Promise(async(resolve, reject) => {
    const len = $('img').length;
    for (let i = 0; i < len; i++) {
      await core.sleep(10);
      const src = $('img').eq(i).attr('src');
      if (src && src.indexOf('http') === 0) {
        //保存图片
        const stamp = +new Date();
        request(src).pipe(fs.createWriteStream(`${articlePath}/img/${stamp}.png`));
        $('img').eq(i).attr('src', `./img/${stamp}.png`);
      }
    }
    resolve();
  });
}

module.exports = spiderInit;