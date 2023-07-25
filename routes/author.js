const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const router = express.Router();
const Author = require('../models/author');

filename ='';
const mystorage = multer.diskStorage({
    destination: './uploads/profile',
    filename: (req, file, redirect)=>{
        let date = Date.now();
        let fl = date + '.' + file.mimetype.split('/')[1];
        redirect(null, fl);
        filename = fl;
    }
})
const upload = multer({storage: mystorage})


router.post('/register',upload.any('image'), (req, res)=>{
    data = req.body;
    author = new Author(data);
    author.image = filename;
    salt = bcrypt.genSaltSync(10);
    author.password = bcrypt.hashSync(data.password, salt);
    author.save()
        .then(
            (savedAuthor)=>{
                filename = "";
                res.status(200).send(savedAuthor);
            }
        )
        .catch(
            err=>{
                res.send(err)
            }
        )
})
router.post('/login', (req, res)=>{
    data = req.body;
    Author.findOne({email: data.email})
    .then(
        (author)=>{
            let valid =bcrypt.compareSync(data.password, author.password);
            if(!valid){
                res.send('email or password invalid');
            }else{
                let payload = {
                    _id: author._id,
                    email: author.email,
                    fullname: author.name + ' ' + author.lastname
                }
                let token = jwt.sign(payload, '123456789');
                res.send({ mytoken: token})
            }
        }
    )
    .catch(
        err=>{
            res.send(err)
        }
    )
})
router.get('/all', (req, res)=>{
    Author.find({})
    .then(
    (authors)=>{
        res.status(400).send(authors);
    }
    )
    .catch(
        (err)=>{
            res.status(400).send(err);
        }
    )
    
})
router.get('/getbyid/:id', (req, res)=>{
    let id = req.params.id
    Author.findOne({_id: id})
        .then(
        (authors)=>{
            res.status(400).send(authors);
        }
        )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
})
router.delete('/delete/:id', (req, res)=>{
    let id = req.params.id
    Author.findByIdAndDelete({_id: id})
        .then(
        (authors)=>{
            res.status(200).send(authors);
        }
        )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
})
router.put('/update/:id', upload.any('image') , (req, res)=>{
    let id = req.params.id
    let data = req.body;
    data.tags = data.tags.split(',');
    if(filename.length > 0){
        data.image = filename;
    }
    Author.findByIdAndDelete({_id: id}, data)
        .then(
            (authors)=>{
                filename = '' ;
                res.status(200).send(authors);
            }
            )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
})

module.exports = router;