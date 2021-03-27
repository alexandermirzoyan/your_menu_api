const express = require('express');
const mongoose = require('mongoose');
const app = express();
mongoose.connect('mongodb://localhost/YourMenu', {useNewUrlParser: false});
const Schema = mongoose.Schema;

const EntitiesModel = mongoose.model('entities', new Schema({name: String}, {collection: 'entities'}));
const MenuListModel = mongoose.model('menuList', new Schema({name: String}, {collection: 'menuList'}));

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
