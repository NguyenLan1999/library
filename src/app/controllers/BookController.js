const Book = require('../models/book');
const Comment = require('../models/comment');
const { mongooseToObject } = require('../../util/mongoose');
const jwt = require('jsonwebtoken')

class BookController{
    show(req, res, next){
        const token = req.signedCookies.token;
        if(token){
            var data = jwt.verify(token, 'mk')
             var isTrue = true
             Book.findOne({ slug: req.params.slug })
             .populate({path: 'UserId'})
             .populate({path: 'declaim', populate: { path: 'UserId'} })
            .then((book) => {
                if(book.UserId === data._id){
                    res.render('books/show', { 
                        book: mongooseToObject(book),
                        data: data,
                        isTrue: isTrue
                    });
                }else{
                    res.render('books/show', { 
                        book: mongooseToObject(book),
                        data: data
                    });
                }
                
            })
            .catch(next)
        }else{
            Book.findOne({ slug: req.params.slug })
            .populate({path: 'UserId'})
             .populate({path: 'declaim', populate: { path: 'UserId'} })
            .then((book) => {
                res.render('books/show', { 
                    book: mongooseToObject(book)
                });
            })
            .catch(next)
        }
        
       

    }

     //[GET] /detailbook/create
     create(req, res, next) {
        const token = req.signedCookies.token;
        var data = jwt.verify(token, 'mk')
            res.render('books/create', {data: data})
        }

         //[POST] /detailbook/store
         store(req, res, next) {
            const token = req.signedCookies.token;
            var data = jwt.verify(token, 'mk')

            const name= req.body.name
            const author = req.body.author
            const introduce= req.body.introduce
            const description = req.body.description
            var img = req.file
    
            if(name){
                if(img){
                    img = img.path.split('\\').slice(2).join('/')
                    let book = new Book({
                        name: name,
                        author: author,
                        description: description,
                        introduce: introduce,
                        img: img,
                        UserId: data._id
                    });
                    book.save()
                        .then(() => {
                            req.session.message ={
                                type: 'success',
                                intro: 'Thông báo!',
                                message: 'Bài viết đã được thêm thành công!!!!'
                            }
                            res.redirect('/')})
                        .catch(error=>{
        
                        })
                }else{
                    let book = new Book({
                        name: name,
                        author: author,
                        description: description,
                        introduce: introduce,
                        UserId: data._id
                    });
                    book.save()
                        .then(() => {
                            req.session.message ={
                                type: 'success',
                                intro: 'Thông báo!',
                                message: 'Bài viết đã được thêm thành công!!!!'
                            }
                            res.redirect('/')})
                        .catch(error=>{
        
                        })
                }
                
                }else{
                    req.session.message ={
                        type: 'danger',
                        intro: 'Thông báo lỗi!',
                        message: 'Vui lòng trường tên sách không được để trống!!!!'
                    }
                    res.redirect('back')
                }
            
            
         }

    edit(req, res, next){
        const token = req.signedCookies.token;
        var data = jwt.verify(token, 'mk')
        Book.findById(req.params.id)
        .then((book)=>{
           
                res.render('books/edit', { book: mongooseToObject(book),  data: data })
        })
    }

    update(req, res, next){
        const token = req.signedCookies.token;
        var data = jwt.verify(token, 'mk')
        var img = req.body.img
        if(img){
            img = img.path.split('\\').slice(2).join('/')
            Book.updateOne({ _id: req.params.id }, {
                name: req.body.name,
                author: req.body.author,
                description: req.body.description,
                introduce: req.body.introduce,
                img: img,
                UserId: data._id,
            })
                    .then(()=> {
                        req.session.message ={
                            type: 'success',
                            intro: 'Thông báo!',
                            message: 'Bài viết được cập nhật thành công!!!!'
                        }
                        res.redirect('/')})
                    .catch(next)
        }else{
            
            Book.updateOne({ _id: req.params.id }, {
                name: req.body.name,
                author: req.body.author,
                description: req.body.description,
                introduce: req.body.introduce,
                UserId: data._id,
            })
                    .then(()=> {
                        req.session.message ={
                            type: 'success',
                            intro: 'Thông báo!',
                            message: 'Bài viết được cập nhật thành công!!!!'
                        }
                        res.redirect('/')})
                    .catch(next)
        }


    }

    delete(req, res, next){
        const token = req.signedCookies.token;
        var data = jwt.verify(token, 'mk')

        if(data){
            Book.deleteOne({_id: req.params.id})
            .then(()=> {
                req.session.message ={
                    type: 'success',
                    intro: 'Thông báo!',
                    message: 'Bài viết đã được xóa thành công!!!!'
                }
                res.redirect('/')})
            .catch(next)
        
        }
    }

    commentPost(req, res, next){
        const token = req.signedCookies.token;
        const bookId = req.params.id;
        const content = req.body.content;
       
        if(token){
            var data = jwt.verify(token, 'mk')
            if(content){
                const comment = new Comment({
                    UserId: data._id,
                    content: content
                });
                comment.save((err, result)=>{
                    if(err){
                        console.log(err)
                    }else{
                        Book.findByIdAndUpdate(req.params.id,
                             { $push:{declaim: result}}).exec()
                        res.redirect('back')
                    }
                    
                })
            }else{
                req.session.message ={
                    type: 'danger',
                    intro: 'Thông báo lỗi!',
                    message: 'Vui lòng nhập lại bình luận!!!!'
                }
                res.redirect('back')
            }
            
        }
        else{
            req.session.message ={
                        type: 'danger',
                        intro: 'Thông báo lỗi!',
                        message: 'Bạn cần đăng nhập vào hệ thống để thực hiện chức năng!!!!'
                    }
                    res.redirect('back')
        }
        


       }
      


        
       
    
}


module.exports = new BookController();