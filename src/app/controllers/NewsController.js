const Book = require('../models/book');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class NewsController {
    index(req, res, next) {
        Book.find({})

        .then((books) => {
           
            res.render('home', {
                books: mutipleMongooseToObject(books),
            });
        })
        .catch(next);
    }

    search(req, res, next) {
       
        //var email = req.signedCookies.email

        Book.find({ 'name': {'$regex': req.query.q.toLowerCase(),$options:'i'}})
            .then((books) => {
                res.render('search', { 
                    books: mutipleMongooseToObject(books),
                    });
            })
            .catch(next);

        
       

    }


    getLogin(req, res, next){
        res.render('user/login');
    }

    postLogin(req, res, next){

    }
    getRegister(req, res, next){
        res.render('user/register');
    }
    postRegister(req, res, next){

    }
}

module.exports = new NewsController();
