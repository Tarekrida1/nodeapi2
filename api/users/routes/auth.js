const express = require("express");
const { register , login, currentUser } = require('../controllers/auth');

const router = express.Router();

const { protect, authorize } = require('../../../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile',protect , currentUser);



module.exports = router;
