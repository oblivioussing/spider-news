var puppeteer = require('puppeteer');
var core = require('../base/core');
var fs = require('fs');
const root = 'D:/Project/nodejs/spider-news'
let $;
let articlePath; //文章目录

var test = (req) => {
  return new Promise(async(resolve, reject) => {
    // const url = req.url;
    const articleCode = req.code;
    // !url && reject();
    //需要返回结果
    let result = {
      title: '', //标题
      desc: '', //描述
      minipic: '', //头图
      url: '', //文章地址
      code:''
    }
    // // //创建puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36' })
    // await page.goto(url);

    // await page.waitFor(500);
    // // // //模拟点击事件
    // await page.waitForSelector('._3em8Ej2zWZAW8Nj3xKSF9c');
    // await page.click('._3em8Ej2zWZAW8Nj3xKSF9c');
    // // // //根据文章id创建文件夹(如果存在则删除)
    articlePath = `${root}/article/${articleCode}`;
    if (!fs.existsSync(articlePath)) {
      fs.mkdirSync(articlePath); //文章目录
      fs.mkdirSync(articlePath + '/img'); //图片目录
      fs.mkdirSync(articlePath + '/minipic'); //头图目录
    }
    // // //获取并下载头图
    await core.sleep(500);
    // const minipic = await ascend(page);
    // minipic && saveMinipic(minipic);
    result.minipic = `${root}/article/${req.code}/minipic/minipic.png`;
    result.code = req.code;
    //关闭浏览器
    await browser.close();
    resolve(result);
    return false;
  });
}

//选择头图
var ascend = async(page) => {
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

module.exports = test;