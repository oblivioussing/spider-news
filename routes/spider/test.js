const puppeteer = require('puppeteer');
var devices = require('puppeteer/DeviceDescriptors');
var iPhone = devices['iPhone 6'];

(async() => {
  // const browser = await puppeteer.launch({ headless: false });
  // const page = await browser.newPage();
  // await page.emulate(iPhone);
  // await page.goto('https://www.baidu.com/');
  // await page.focus('#index-kw'); // 焦点到搜索关键字输入框
  // await page.type('#index-kw','woca', { delay: 100 }); // 输入关键字 Chrome Headless
  // await page.click('#index-bn'); // 点击“百度一下”提交按钮
})();