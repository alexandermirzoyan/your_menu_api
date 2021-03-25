const express = require('express');
const mongoose = require('mongoose');
const app = express();
mongoose.connect('mongodb://localhost/YourMenu', {useNewUrlParser: false});
const Schema = mongoose.Schema;

const MyModel = mongoose.model('menuList', new Schema({name: String}, {collection: 'menuList'}));

app.get('/', (req, res) => {
  MyModel.find((error, result) => {
    res.send(result);
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
