const User = require('../models/user');
const Book = require('../models/book');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const jwt = require('jsonwebtoken')

class NewsController {
    index(req, res, next) {
        const token = req.signedCookies.token;
        if(token){
            var data = jwt.verify(token, 'mk')
            Book.count().exec(function(err, count){
                var Random = Math.floor(Math.random()*count)
                Book.find({}).skip(Random).limit(10)
                .then((books) => {
                   
                    res.render('home', {
                        books: mutipleMongooseToObject(books),
                        data: data
                    });
                })
                .catch(next);
            })
           
        }else{
            Book.find({}).limit(6)
    
            .then((books) => {
               
                res.render('home', {
                    books: mutipleMongooseToObject(books)
                });
            })
            .catch(next);
        }
       
    }

    search(req, res, next) {
       
        const token = req.signedCookies.token;
        if(req.query.q){
        if(token){
            var data = jwt.verify(token, 'mk')

            Book.find({ 'name': {'$regex': req.query.q.toLowerCase(),$options:'i'}})
                .then((books) => {
                    res.render('search', { 
                        books: mutipleMongooseToObject(books),
                        data: data
                        });
                })
                .catch(next);
        }else{
            Book.find({ 'name': {'$regex': req.query.q.toLowerCase(),$options:'i'}})
                .then((books) => {
                    res.render('search', { 
                        books: mutipleMongooseToObject(books)
                        });
                })
                .catch(next);
        }
    }
       
    }

    userhome(req, res, next){
        const token = req.signedCookies.token;
        if(token){
            var data = jwt.verify(token, 'mk')
            Book.find({UserId: data._id})
            .then((books)=>{
                res.render('userhome', {
                    books: mutipleMongooseToObject(books),
                    data: data
                });
            })
            .catch(next);

        }else{
            req.session.message ={
                type: 'danger',
                intro: 'Lỗi!',
                message: 'Bạn chưa đăng nhập vào hệ thống!!!!'
            }
            res.redirect('back')
        }
    }

}

module.exports = new NewsController();
