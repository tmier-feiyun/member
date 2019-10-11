const express = require('express');
const router = express.Router();
const multer = require('multer');

// 上传文件的目录与app.js目录平级
var uploadFolder = './upload/';

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadFolder); // 保存的路径，需要自己创建
    },
    filename: function (req, file, cb) {
      // 将保存文件名设置为  时间戳 + 字段名
      cb(null, Date.now() + '-' + file.originalname);
    }
  })
});

// 只针对单个文件上传，如果希望上传文件的同时还附加普通字段，则需额外处理。
// ulpload.single(file文件域的name值)
router.post('/upload', upload.single('file'), function (req, res, next) {
  var file = req.file;
  console.info(req.file);
  console.log('文件类型：%s', file.mimetype);
  console.log('原始文件名：%s', file.originalname);
  console.log('文件大小：%s', file.size);
  console.log('文件保存路径：%s', file.path);
  res.send('ok');
});

/* router.post('/reg', function (req, res, next) {
  // res.send(req.body)
  console.dir(req);
  res.send('ok');
}); */

module.exports = router;
