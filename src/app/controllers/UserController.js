const User = require('../models/user');
const { mongooseToObject } = require('../../util/mongoose');
const jwt = require('jsonwebtoken')

class UserController{
    view(req, res, next){
        const token = req.signedCookies.token;
        var data = jwt.verify(token, 'mk')
        User.findById(data._id)
        .then(user=>{
            res.render('user/view', {user : mongooseToObject(user), data: data})
        })
        .catch(next)
        
    }
    edit(req, res,next){
        const token = req.signedCookies.token;
        var data = jwt.verify(token, 'mk')
        User.findById(data._id)
        .then(user=>{
            res.render('user/edit', {
                user: mongooseToObject(user),
                data: data})

        })
        .catch(next)
    }

    postEdit(req, res, next){
        const token = req.signedCookies.token;
        var data = jwt.verify(token, 'mk')
    
        const username = req.body.username
        const phone = req.body.phone
        const address = req.body.address
        const history = req. body.history

        if(!username){
            req.session.message ={
                type: 'danger',
                intro: 'Thông báo lỗi!',
                message: 'Tên đăng nhập không được để trống!!!!'
            }
            res.redirect('back')
        }
        if(!(phone.length === 10)){
            req.session.message ={
                type: 'danger',
                intro: 'Thông báo lỗi!',
                message: 'Vui lòng nhập lại số điện thoại!!!!'
            }
            res.redirect('back')
        }

        User.findByIdAndUpdate(data._id, {
            username: username,
            phone: phone,
            address: address,
            history: history
        })
        .then(()=>{
            req.session.message ={
                type: 'success',
                intro: 'Thông báo!',
                message: 'Thông tin cá nhân được cập nhật thành công!!!!'
            }
            res.redirect('/user/view')
        })
        .catch(next)
    }
}



module.exports = new UserController();