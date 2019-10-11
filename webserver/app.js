const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
// const moment = require('moment')
const multipart = require('connect-multiparty')
const request = require('request')
const common = require('./router/common')
const routerFormDate = require('./router/formdata')
const routerMessage = require('./router/message')
const routerMember = require('./router/member')
const routerWeb = require('./router/web')


const app = express()
app.use(cors())

process.argv.exe = process.argv[2] !== 'dev'
// 设置静态资源
if (process.argv.exe) {
  app.use(express.static(path.join(path.dirname(process.execPath), 'public')))
} else {
  app.use(express.static(path.join(__dirname, 'public')))
}
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/common', common)
app.use('/message', routerMessage)
app.use('/formData', routerFormDate)
app.use('/web', routerWeb)
app.use('/member', routerMember)

var multipartMiddleware = multipart()
app.post('/fd', multipartMiddleware, (req, res) => {
  // console.log(req.files);
  if (JSON.stringify(req.files) === '{}') {
    res.send(req.body)
  } else {
    res.send([req.body, req.files])
  }
  // res.send(req.body);
})

app.post('/query-post', (req, res) => {
  res.send(req.body)
})

app.get('/query-get', (req, res) => {
  res.send(req.query)
})

app.use((req, res) => {
  let url = path.join(__dirname, 'public', req.url)
  if (process.argv.exe) {
    url = path.join(path.dirname(process.execPath), 'public', req.url)
  }
  if (fs.existsSync(url)) {
    res.sendFile(url)
  } else {
    request(req.url, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        res.send(body)
      } else {
        res.send({ success: false, url, error: 404 })
      }
    })
  }
  // }
})

app.listen(3005, (req, res) => {
  console.log('！！运行成功！！开始监听端口：3005。请打开浏览器，输入http://localhost:3005查看效果')
})
