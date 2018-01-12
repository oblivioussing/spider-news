module.exports = {
  //延时
  sleep: async(time) => {
    return new Promise((resovle, reject) => {
      setTimeout(() => {
        resovle();
      }, time);
    });
  }
}