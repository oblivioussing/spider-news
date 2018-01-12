/**接口响应对象**/
const interfaceResult = {
  success: { resultCode: '10', resultMsg: '接口调用成功' },
  authFail: { resultCode: '11', resultMsg: '接口调用失败' },
  noLogin: { resultCode: '12', resultMsg: '未登录' },
  loginExpire: { resultCode: '13', resultMsg: '登陆超时' },
  locked: { resultCode: '14', resultMsg: '失败登录次数过多，用户被锁定' },
  loginNameNotNull: { resultCode: '15', resultMsg: '登录名不能为空' },
  tokenSaltNotNull: { resultCode: '16', resultMsg: '权限认证失败' }
}
/**业务响应对象**/
// 格式:模块编号 + 功能编号 + 响应编号，
// 例如:101010-url不能为空  10 爬虫模块、 10 抓取、 10 url不能为空
const spiderResult = {
  success: { resultCode: interfaceResult.success.resultCode, resultMsg: '文章抓取成功' },
  urlNotNull: { resultCode: '101010', resultMsg: 'url不能为空' },
  acNotNull: { resultCode: '101110', resultMsg: 'articleCode不能为空' },
  baseUrlNotNull: { resultCode: '101210', resultMsg: 'staticBaseUrl不能为空' },
  basePathNotNull: { resultCode: '101310', resultMsg: 'staticBasePath不能为空' },
  mCodeNotNull: { resultCode: '101410', resultMsg: 'mCode不能为空' },
  videoUrlNull: { resultCode: '101511', resultMsg: '视频地址为空' }
}

module.exports = { interfaceResult, spiderResult }