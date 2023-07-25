const express = require('express');
const multer = require('multer');
const router = express.Router();
const Article = require('../models/article');

filename ='';
const mystorage = multer.diskStorage({
    destination: './uploads/articles',
    filename: (req, file, redirect)=>{
        let date = Date.now();
        let fl = date + '.' + file.mimetype.split('/')[1];
        redirect(null, fl);
        filename = fl;
    }
})
const upload = multer({storage: mystorage})

router.post('/add', upload.any('image') , (req, res) =>{
    let data = req.body;
    let article = new Article(data);
    article.date = new Date();
    article.image = filename;
    article.tage = data.tags.split(','); 
    article.save()
        .then(
            (saved)=>{
                filename = '';
                res.status(200).send(saved);
            }
        )
        .catch(
            err=>{
                res.status(400).send(err)
            }
        )
}),
router.get('/all', (req, res)=>{
    Article.find({})
        .then(
        (articles)=>{
            res.status(400).send(articles);
        }
        )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
}),
router.get('/getbyid/:id', (req, res)=>{
    let id = req.params.id
    Article.findOne({_id: id})
        .then(
        (articles)=>{
            res.status(400).send(articles);
        }
        )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
}),
router.get('/getbyidauthore/:id', (req, res)=>{
    let id = req.params.id
    Article.find({idAuthor: id})
        .then(
        (articles)=>{
            res.status(200).send(articles);
        }
        )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
}),
router.get('/delete/:id', (req, res)=>{
    let id = req.params.id
    Article.findByIdAndDelete({_id: id})
        .then(
        (articles)=>{
            res.status(200).send(articles);
        }
        )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
}),
router.put('/update/:id', upload.any('image') , (req, res)=>{
    let id = req.params.id
    let data = req.body;
    data.tags = data.tags.split(',');
    if(filename.length > 0){
        data.image = filename;
    }
    Article.findByIdAndDelete({_id: id}, data)
        .then(
            (articles)=>{
                filename = '' ;
                res.status(200).send(articles);
            }
            )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
}),


module.exports = router;