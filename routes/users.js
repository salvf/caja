var express = require('express');
var router = express.Router();
var socketapi = require("../socket");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('cliente', { title: 'Express' });
});

/* GET home page. */
router.get('/dash', function(req, res, next) {
  res.render('dashboard');
});
module.exports = router;
