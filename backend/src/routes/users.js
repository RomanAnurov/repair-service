const express = require('express');
const router = express.Router();
const { getAllUsers, getUserByName } = require('../controllers/userController');

router.get('/', getAllUsers);
router.get('/by-name/:name', getUserByName);

module.exports = router;