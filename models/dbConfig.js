const mongoose = require('mongoose');


mongoose.connect(
  "mongodb://localhost:27017/api_jwt",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if(!err) console.log('Mongo OK');
    else console.log('Mongo ERROR : ' + err);
  }
)