const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const path = require('path');
const users = ['张三', '李四', '王五'];
const fs = require('fs');
// FormData 使用

var multipartMiddleware = multipart();
/* router.get('/testChart', function (req, res) {
  res.send(req.query.char);
}); */

router.get('/get', function (req, res) {
  let d = Object.assign({}, req.query, {
    _t: Date.now(),
    msg: '服务器返回成功',
    code: 200
  });
  res.json(d);
});

router.post('/post', multipartMiddleware, function (req, res) {
  let d = Object.assign({}, req.body, {
    _t: Date.now(),
    msg: '服务器返回成功',
    code: 200
  });
  res.json(d);
});

/**
 * 获取当前系统的时间戳
 * @param 无
 * @return 当前的时间
 */
router.get('/getCurrentTime', function (req, res) {
  res.json({
    currentTime: Date.now().toString(),
    code: 200,
    msg: '服务器返回成功'
  });
  // res.send(Date.now().toString());
});

/**
 * url: /common/checkUser
 * get方式验证用户名是否占用
 * 参数：
 * @param {String} username : 用户名
 * @return
 * 404 ： 表示 已经被占用，不能使用
 * 200 ： 表示 没有被占用，可以使用
 */
/* router.get('/checkUser', (req, res) => {
  let ret = users.indexOf(req.query.username) > -1 ? { code: 200, msg: '用户名可以使用' } : { code: 404, msg: '用户名已被占用' };
  res.json(ret);
}); */

/**
 * post方式验证用户名是否占用
 * 参数：
 *  username
 * 返回值
 * 404 ： 表示 已经被占用，不能使用
 * 200 ： 表示 没有被占用，可以使用
 */
router.post('/checkUser', (req, res) => {
  console.log(users.indexOf(req.body.username), users, req.body);

  let ret = users.indexOf(req.body.username) === -1 ? { code: 200, msg: '用户名可以使用' } : { code: 404, msg: '用户名已被占用' };
  res.json(ret);
});

/**
 * post方式验证用户登陆信息。
 * 有效信息是：username:admin,password:123456
 * 参数：
 *  userName: 用户名
 *  password：密码
 * 返回值
 *  404 ： 表示 已经被占用，不能使用
 *  200 ： 表示 没有被占用，可以使用
 */
router.post('/login', (req, res) => {
  let name = req.body.username;
  let password = req.body.password;
  if (name === 'admin') {
    if (password === '123456') {
      res.json({ code: 200, msg: '用户名和密码正确，可以登录！~' });
    } else {
      res.json({ code: 404, msg: '用户名或密码错误，我不会告诉你是密码错了~' });
    }
  } else {
    res.json({ code: 404, msg: '用户名或密码错误，我不会告诉你是用户名不存在~' });
  }
});

router.get('/getBookMsgXML', (req, res) => {
  let url = path.join(path.join(__dirname, '../'), 'database/db.xml');
  if (process.argv.exe) {
    url = path.join(path.join(process.execPath, '../'), 'database/db.xml');
  }
  res.sendFile(url);
});

router.get('/getBookMsgJSON', (req, res) => {
  let obj = [{ author: '吴承恩', title: '西游记' }, { author: '施耐庵', title: '水浒传' }, { author: '罗贯中', title: '三国演义' }, { author: '曹雪芹', title: '红楼梦' }];
  res.json(obj);
});

/* router.get('/getFourMasterpiecesStr', (req, res) => {
  let str = '作者：吴承恩，书名：西游记；作者：施耐庵，书名：水浒传；作者：罗贯中，书名：三国演义；作者：曹雪芹，书名：红楼梦';
  res.send(str);
}); */

router.get('/sleep', (req, res) => {
  let sleepTime = req.query.sleepTime || 5;

  let now = Date.now();
  while (Date.now() - now < sleepTime * 1000) { }
  console.info('请求中........');

  res.json({ code: 200, msg: '服务器忙, 等待了' + sleepTime + '秒后返回数据', data: '为天地立心，为生民立命，为往圣继绝学，为万世开太平' });
});

/* router.get('/shortData', (req, res) => {
  console.info('请求shortData........');
  let str = '为天地立心，为生民立命，为往圣继绝学，为万世开太平。';
  res.json({ code: 200, msg: '服务端返回数据成功', data: str });
}); */

router.get('/bigData', (req, res) => {
  console.info('请求bigData........');
  let str = '为天地立心，为生民立命，为往圣继绝学，为万世开太平。';
  let i = 0;
  let longStr = '随机数据：';
  while (i < 100 * 100) {
    i++;
    longStr += Math.random() + str;
  }
  longStr += '----------数据加载完毕----------';
  res.json({ code: 200, msg: '服务端返回数据成功', data: longStr });
});

module.exports = router;
