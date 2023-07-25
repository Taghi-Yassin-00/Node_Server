const express = require('express');
const articleApi = require('./routes/article');
const authorApi = require('./routes/author');
require('./config/connect')


const app = express();
app.use(express.json());
app.use('/article', articleApi);
app.use('/author', authorApi);

app.use("/getimage", express.static("./uploads/articles"))

app.listen(3000, ()=>{
    console.log('server running...')
})