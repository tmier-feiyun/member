const express = require('express')
const router = express.Router()
const db = require('../db')
const multer = require('multer')
const path = require('path')
/**
 * 获取全部会员列表
 *
 * @param somebody
 * @return
 */
router.get('/list', (req, res) => {
  const data = db.get()
  res.send(data)
})

/**
 * 分页获取
 */
router.get('/list-page', (req, res) => {
  const page = parseInt(req.query.page) || 1
  const data = db.getByPage(page, 6)
  res.send(data)
})

/**
 * 最后一条获取
 */
router.get('/list-last', (req, res) => {
  const last = parseInt(req.query.last) || null
  const data = db.getByLast(last, 6)
  res.send(data)
})

/**
 * 获取指定会员信息
 */
router.get('/detail', (req, res) => {
  const id = parseInt(req.query.id)
  var user_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  console.info(user_ip, '查询成员详情. id=', id)
  if (!id) {
    return res.send({ success: false, message: '请求参数异常' })
  }
  // 获取指定 ID 的数据
  const data = db.getById(id)

  data
    ? res.send({ success: true, data: data })
    : res.send({ success: false, message: '未找到对应数据' })
})

// 文件上传处理
const uploader = multer({
  storage: multer.diskStorage({
    // 上传文件存放目录
    // destination: (req, file, cb) => cb(null, path.join(path.dirname(process.execPath) + '/public/upload')),
    // destination: (req, file, cb) => cb(null, path.join(path.dirname(process.execPath) + '/public/upload')),
    destination: (req, file, cb) => {
      console.info('----', process.execPath)

      let url = path.join(__dirname, '../public/member/upload')

      /* if (process.argv.exe) {
        url = path.join(path.dirname(process.execPath), './public/upload')
      } */
      console.info(url)
      try {
        cb(null, url)
      } catch (e) {
        console.info('file upload error', e)
      }
    },
    // 上传文件的文件名
    filename: (req, file, cb) => cb(null, file.originalname)
  })
})
/**
 * 添加一个新会员
 */
router.post('/add', uploader.single('avatar'), (req, res) => {
  // res.send([req.body, req.file]);
  if (!(req.body.name && req.body.bio && req.file)) {
    return res.send({ code: 404, msg: '参数异常' })
  }
  const member = {
    name: req.body.name,
    avatar: `./upload/${req.file.filename}`,
    bio: req.body.bio,
    created: new Date()
  }
  // 保存数据
  db.add(member)
  res.send({ code: 200, msg: '数据保存成功' })
})

/**
 * 删除一个会员
 */
router.post('/delete', (req, res) => {
  const id = parseInt(req.body.id)
  console.info('删除一个会员', id)
  if (!id) {
    return res.send({ code: 404, msg: '请求参数异常' })
  }
  db.delete(id)
  res.send({ code: 200, msg: '数据删除成功' })
})

module.exports = router
