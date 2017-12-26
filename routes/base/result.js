/**接口响应对象**/
const interfaceResult = {
  success: { resultCode: '10', msg: '接口调用成功' },
  authFail: { resultCode: '11', msg: '接口调用失败' },
  noLogin: { resultCode: '12', msg: '未登录' },
  loginExpire: { resultCode: '13', msg: '登陆超时' },
  locked: { resultCode: '14', msg: '失败登录次数过多，用户被锁定' },
  loginNameNotNull: { resultCode: '15', msg: '登录名不能为空' },
  tokenSaltNotNull: { resultCode: '16', msg: '权限认证失败' }
}
/**业务响应对象**/
// 格式:模块编号 + 功能编号 + 响应编号，
// 例如:101010-url不能为空  10 爬虫模块、 10 抓取、 10 url不能为空
const spiderResult = {
  success: { resultCode: interfaceResult.success.resultCode, msg: '文章抓取成功' },
  urlNotNull: { resultCode: '101010', msg: 'url不能为空' },
  acNotNull: { resultCode: '101110', msg: 'articleCode不能为空' },
  baseUrlNotNull: { resultCode: '101210', msg: 'staticBaseUrl不能为空' },
  basePathNotNull: { resultCode: '101310', msg: 'staticBasePath不能为空' },
  mCodeNotNull: { resultCode: '101410', msg: 'mCode不能为空' }
}

module.exports = { interfaceResult, spiderResult }