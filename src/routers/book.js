const express = require('express');
const router = express.Router();
const multer  = require('multer');
const path = require('path')

router.use(express.static('src/public'));

const bookController = require('../app/controllers/BookController');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, ('./src/public/img'))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
    
  })
const upload = multer({ storage: storage })

router.post('/:id/comment', bookController.commentPost);
router.get('/create', bookController.create);
router.post('/store', upload.single('img'), bookController.store);
router.get('/:id/edit', upload.single('img'),bookController.edit);
router.put('/:id', bookController.update);
router.delete('/:id', bookController.delete);
router.get('/:slug', bookController.show);

module.exports = router;