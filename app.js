var express = require('express')
var bodyparser = require('body-parser')
var mongoose = require('mongoose')
var Business = require('./routes/business')
var Category = require('./routes/category')
var User = require('./routes/user')
var multer = require('multer')
var morgan = require('morgan')
var jwt = require('./helpers/jwt')
var cors = require('cors')
var morgonBody = require('morgan-body')
const upload = require('./services/aws_image_uploader')
const errorHandler = require('./helpers/errorHandler')
const googleUtil = require('./helpers/googleUtil')

const config = require('config')
const dbConfig = config.get('app.dbConfig')


require('dotenv').config()


var app = express()
app.use(morgan('dev'))
app.use(bodyparser.json())
morgonBody(app)
app.use(bodyparser.urlencoded({ extended: false }))
app.post('/auth/google', async (req, res) => {
  // const { google } = require('googleapis')

  // const oauth2 = google.oauth2('v2');
  // const OAuth2 = google.auth.OAuth2;

  // const authClient = new OAuth2(
  //   process.env.GOOGLE_CLIENT_ID,
  //   process.env.GOOGLE_CLIENT_SECRET,
  // );
  var userinfo = await googleUtil.getUserInfo(req.body.accessToken)
  console.log(userinfo)
})
app.use(jwt())
app.use('/business', Business)
app.use('/category', Category)
app.use('/auth', User)
app.use(errorHandler)


mongoose.connect(`mongodb://${dbConfig.host}/${dbConfig.dbName}`, { useNewUrlParser: true })

app.post('/upload', function (req, res) {
  console.log(req.files)
  upload(req, res, function (err) {
    if (err) {
      return res.status(422).send({ errors: [{ title: 'Image Upload Error', detail: err.message }] });
    }
    req.files.forEach(function (element) {
      console.log(element.location)
    })
    return res.json({ 'imageUrl': "uploaded successfully" });
  })
})

app.listen(3000, function () {
  console.log(process.env.DB_HOST)
})