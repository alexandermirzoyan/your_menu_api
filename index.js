const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");

const app = express();
mongoose.connect('mongodb://localhost/YourMenu', {useNewUrlParser: false});
const Schema = mongoose.Schema;

const EntitiesModel = mongoose.model('entities', new Schema({name: String}, {collection: 'entities'}));
const MenuListModel = mongoose.model('menuList', new Schema({name: String}, {collection: 'menuList'}));

const allowList = ["http://localhost:3000"];
app.use(cors({
  origin: function (origin, cb) {
    if (allowList.indexOf(origin) !== -1 || !origin) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json());
app.use(express.static(__dirname + "/media/images"));

app.get('/', (req, res) => {
  res.send('Unauthorized');
});

app.get('/Entities', (req, res) => {
  EntitiesModel.find((error, result) => {
    res.send(result);
  });
});

app.get('/MenuItems', (req, res) => {
  MenuListModel.findOne({entityId: req.query.entity}, (error, result) => {
    res.send(result);
  });
});

app.post('/SetOrder', (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      // type: "OAuth2",
      user: "alexandr.mirz12@gmail.com",// process.env.EMAIL
      pass: "Alzapet.032002",
      /*clientId: "1051223923501-3idpg2pfd02buqpu4ipfkdnugsn2p6k6.apps.googleusercontent.com", // process.env.CLIENT_ID
      clientSecret: "6tbHBKPffODnoAPAGwaHg78D", // process.env.CLIENT_SECRET
      refreshToken: "1//0fV3ZhQSi5mYwCgYIARAAGA8SNwF-L9IrcPK9PSKabLFmyO6-Fs3WOKqKAp2DNv0uVxZ7tz_B-iNLByJTVl0jX_iqv1jTqinYXzY", // process.env.REFRESH_TOKEN*/
    },
  }, /*{
    rejectUnauthorized: false
  }*/);

  const mailOptions = {
    from: "alexandr.mirz12@gmail.com",
    to: ["alexandr.mirz12@gmail.com"],
    subject: `Պատվեր 12րդ սեղանից`,
    text: 'ասդասդադս',
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (!err) {
      res
        .status(200)
        .send({
          resultCode: 1,
          result: "Պատվերը հաստատվեց!"
        });
    }
    else {
      console.log(err);
      res
        .send(200)
        .status({
          resultCode: 2,
          result: "Կապի խնդիր"
        })
    }
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
