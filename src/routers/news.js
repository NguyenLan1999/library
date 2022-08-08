const express = require('express');
const router = express.Router();

const newsController = require('../app/controllers/NewsController');
const userController = require('../app/controllers/UserController')

router.get('/logout', userController.logout)
router.get('/register', userController.getRegister);
router.post('/signup', userController.postRegister);
router.get('/login', userController.getLogin);
router.post('/signin', userController.postLogin);
router.get('/userhome', newsController.userhome);
router.get('/search', newsController.search);
router.get('/', newsController.index);

module.exports = router;
