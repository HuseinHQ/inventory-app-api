const express = require('express');
const LogController = require('../controllers/LogController');
const router = express();

router.get('/', LogController.getLogs);

module.exports = router;
