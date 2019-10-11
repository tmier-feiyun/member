const path = require('path')
const fs = require('fs')
const express = require('express')
const router = express.Router()

// 留言板接口 -- 获取所有数据
router.get('/getMsg', (req, res) => {
  var url = path.join(__dirname, '../', 'database/message.json')

  /* if (process.argv.exe) {
    url = path.join(path.join(process.execPath, '../'), 'database/message.json')
  } */

  var strData = fs.readFileSync(url)
  var s = JSON.parse(strData)
  res.json(s)
})

router.post('/addMsg', (req, res) => {
  var d = {}
  d.name = req.body.name
  d.content = req.body.content
  d.created = Date.now()

  if (!d.name || !d.content) {
    res.json({ code: 404, msg: '添加失败！' });
    return;
  }

  var url = path.join(__dirname, '../', 'database/message.json')

  /* if (process.argv.exe) {
    url = path.join(path.join(process.execPath, '../'), 'database/message.json')
  } */

  var strData = fs.readFileSync(url)
  var s = JSON.parse(strData)
  // var s = require(url)
  s.push(d)
  fs.writeFile(url, JSON.stringify(s), err => {
    if (err) {
      res.json({ code: 404, msg: '添加失败！' })
    } else {
      res.json({ code: 200, msg: '添加成功！' })
    }
  })
})

router.post('/delMsg', function (req, res) {
  var ts = parseInt(req.body.timestamp);
  if (!ts) {
    res.json({ code: 404, msg: '删除失败！' });
    return;
  }

  var url = path.join(__dirname, '../', 'database/message.json')
  var strData = fs.readFileSync(url)
  var s = JSON.parse(strData)

  var result = s.filter(function (ele) {
    console.log(ele.created, ts);
    return ele.created !== ts;
  });

  fs.writeFile(url, JSON.stringify(result), err => {
    if (err) {
      res.json({ code: 404, msg: '删除失败！' })
    } else {
      res.json({ code: 200, msg: '删除成功！' })
    }
  })



});

module.exports = router
