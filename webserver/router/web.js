const express = require('express')
const router = express.Router()
const request = require('request')

//
/**
 * 获取知乎中最新的新闻
 */
router.get('/getNews', function (req, res) {
  var url = 'http://news-at.zhihu.com/api/4/news/latest'
  console.info('知乎接口', url)
  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var data = JSON.parse(body)
      res.send(data)
    } else {
      res.send('{error:404}')
    }
  })
})
router.get('/getDetailNew', function (req, res) {
  var id = req.query.id
  var url = 'http://news-at.zhihu.com/api/4/news/' + id
  console.info('知乎接口', url)
  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var data = JSON.parse(body)
      res.send(data)
    } else {
      res.send('{error:404}')
    }
  })
})

// https://www.apiopen.top/weatherApi?city=%E5%8C%97%E4%BA%AC
// apiopen 获取天气
router.get('/getWeather', function (req, res) {
  var cityName = req.query.city || '北京'

  var url = 'https://www.apiopen.top/weatherApi?city=' + encodeURI(cityName)

  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var data = JSON.parse(body)
      res.send(data)
    } else {
      res.send('{error:404}')
    }
  })
})

// 获取apiopen提供的新闻接口
router.get('/getApiOpenNews', function (req, res) {
  var url = 'https://www.apiopen.top/journalismApi'
  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var data = JSON.parse(body)
      res.send(data)
    } else {
      res.send('{error:404}')
    }
  })
})
module.exports = router
