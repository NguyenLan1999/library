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


    getLogin(req, res, next){
        res.render('user/login');
    }

    postLogin(req, res, next){
        
        const username = req.body.username;
        const password =req.body.password;

        if(!username && ! password){
            req.session.message ={
                type: 'danger',
                intro: 'Lỗi!',
                message: 'Tên đăng nhập và mật khẩu không được để trống!!!!'
            }
            res.redirect('back');
        }

        if(!username || !password){
            req.session.message ={
                type: 'danger',
                intro: 'Lỗi!',
                message: 'Vui lòng nhập tên đăng nhập !!!!'
            }
            res.redirect('back');

        }

        User.findOne({
            username: username,
            password: password
        })
        .then((user)=>{
            if(user){
               var token = jwt.sign({
                _id: user._id
               }, 'mk')
               console.log(token)
                res.cookie('token', token, { signed: true });
                req.session.message ={
                    type: 'success',
                    intro: 'Thông báo!',
                    message: 'Bạn đã đăng nhập thành công!!!!'
                    }
                res.redirect('/');
            }else{
                req.session.message ={
                    type: 'danger',
                    intro: 'Lỗi!',
                    message: 'Tên đăng nhập hoặc mật khẩu không chính xác !!!!'
                    }
                res.redirect('back');
            }
        })
        
    }
    
    getRegister(req, res, next){
        res.render('user/register');
    }
    postRegister(req, res, next){

        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;

        if(!username && !password && !email){
            req.session.message ={
                type: 'danger',
                intro: 'Lỗi!',
                message: 'Vui lòng điền đầy đủ thông tin!!!!'
            }
            res.redirect('back');
        }
        if(!username || !password || !email){
            req.session.message ={
                type: 'danger',
                intro: 'Lỗi!',
                message: 'Tên đăng nhâp, email không được để trống!!!!!!!'
            }
            res.redirect('back');
        }

        User.findOne({email: email})
        .then((user)=>{
            if(user){
                req.session.message ={
                    type: 'danger',
                    intro: 'Lỗi!',
                    message: 'Email này đã được sử dụng!!!!!!!'
                }
                res.redirect('back')
            }else{
                return User.create({
                    username: username,
                    password: password,
                    email: email,
               })
               .then((user)=>{
                var token = jwt.sign({
                    _id: user._id
                   }, 'mk')
                   console.log(token)
                    res.cookie('token', token, { signed: true });
                req.session.message ={
                    type: 'success',
                    intro: 'Thông báo!',
                    message: 'Bạn đã đăng ký thành công!!!!'
                }
                res.redirect('/');
               })

            }
           
        })
    }
}

module.exports = new NewsController();
