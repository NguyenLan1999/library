const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController')


router.get('/edit', userController.edit);
router.put('/edit', userController.postEdit);
router.get('/view', userController.view);

module.exports = router;