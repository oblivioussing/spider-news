const fs = require('fs');
const path = require('path');

module.exports = {
  //延时
  sleep: async (time) => {
    return new Promise((resovle, reject) => {
      setTimeout(() => {
        resovle();
      }, time);
    });
  },
  //同步创建文件夹
  mkdirsSync: (dirname) => {
    mkdirs(dirname);
  }
}
//同步创建文件夹
const mkdirs = (dirname) => {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirs(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}