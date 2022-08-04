const Book = require('../models/book');
const { mongooseToObject } = require('../../util/mongoose');
const jwt = require('jsonwebtoken')

class BookController{
    show(req, res, next){
        const token = req.signedCookies.token;
        var data = jwt.verify(token, 'mk')
        var isTrue = true
        Book.findOne({ slug: req.params.slug })
        .then((book) => {
            res.render('books/show', { 
                book: mongooseToObject(book),
                data: data
            });
        })
        .catch(next)

    }

     //[GET] /detailbook/create
     create(req, res, next) {
            res.render('books/create')
        }
        
       
    
}


module.exports = new BookController();