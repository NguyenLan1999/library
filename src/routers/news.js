const express = require('express');
const router = express.Router();

const newsController = require('../app/controllers/NewsController');

router.get('/register', newsController.getRegister);
router.post('/signup', newsController.postRegister);
router.get('/login', newsController.getLogin);
router.post('/signin', newsController.postLogin);
router.get('/search', newsController.search);
router.get('/', newsController.index);

module.exports = router;
