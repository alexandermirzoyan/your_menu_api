const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
const secrets = require("./secrets");

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
  const { order, tableNumber } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      // type: "OAuth2",
      user: secrets.USER,
      pass: secrets.PASS,
    },
  });

  const mailOptions = {
    from: "alexandr.mirz12@gmail.com",
    to: ["alexandr.mirz12@gmail.com"],
    subject: `Պատվեր ${tableNumber} սեղանից`,
    text: order,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (!err) {
      res
        .status(200)
        .send({
          resultCode: 1,
          result: "Ձեր պատվերը հաստատվեց, շնորհակալություն"
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
