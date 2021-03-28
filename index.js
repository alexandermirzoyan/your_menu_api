const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
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

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
