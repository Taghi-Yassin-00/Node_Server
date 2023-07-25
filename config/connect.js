const mongoose = require('mongoose')

//Dont put (mongodb://127.0.0.1:27017) it will not work
mongoose.connect('mongodb://127.0.0.1:27017/blog')
    .then(()=>{
        console.log("connected")
    })
    .catch((err)=> {
        console.log(err)
    })
module.exports = mongoose;