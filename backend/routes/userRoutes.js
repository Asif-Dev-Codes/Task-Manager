const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getCurrentUser} = require('../controllers/userControllers');
// const { route } = require('./taskRoutes');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/current', protect,getCurrentUser);
module.exports = router;