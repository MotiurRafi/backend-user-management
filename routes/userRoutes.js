const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/register', userController.register )
router.post('/login', userController.login )
router.get('/', authMiddleware.verifyToken,  userController.getAllUser)
router.put('/status', authMiddleware.verifyToken, userController.updateUserStatus);
router.post('/delete', authMiddleware.verifyToken, userController.deleteUsers);


module.exports = router