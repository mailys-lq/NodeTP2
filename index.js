const express = require('express');
const app = express();
const cors = require('cors');


app.use(cors({
    origin: "*",
    methods: ["GET", "POST", 'PUT', "DELETE", "OPTIONS", "PATCH"]
}));





const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const teamRoute = require('./routes/teams');
require('./models/dbConfig');

app.use(express.json());

app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/teams', teamRoute) ;

app.listen('8000', () => console.log('server start'));