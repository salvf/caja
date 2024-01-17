var express = require('express');
var router = express.Router();
var socketapi = require("../socket");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.post('/enviar', function(req, res, next) {
  console.log(req.body.cliente)
  const jsonData = {
    cliente: req.body.cliente,
    pedido: req.body.pedido,
    caja: req.body.caja
  }
  socketapi.io.emit('json',jsonData);
  res.redirect('/')
});

module.exports = router;
