const Book = require('../models/book');
const { mongooseToObject } = require('../../util/mongoose');

class BookController{
    show(req, res, next){
        Book.findOne({ slug: req.params.slug })
        .then((book) => {
            res.render('books/show', { 
                book: mongooseToObject(book),
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