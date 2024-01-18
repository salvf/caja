var express = require('express');
var router = express.Router();
var socketapi = require("../socket");
var db = require("../utils/db_utils")

/* GET home page. 
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Liverpool' });
});*/

/* GET home page. */
router.post('/enviar', function (req, res, next) {
  console.log(req.body.cliente)
  const jsonData = {
    cliente: req.body.cliente,
    pedido: req.body.pedido,
    caja: req.body.caja
  }
  socketapi.io.emit('json', jsonData);
  res.redirect('/')
});
router.get('/form', function (req, res, next) {
  res.render('user', { title: 'Liverpool' });
});

router.get('/db', function (req, res, next) {
  var a = "Naamr"
  var b = new Date().toISOString().slice(0, 19).replace('T', ' ');
  console.log(b)
  var query=`INSERT INTO BITACORA (nombre_cliente, pedido_cliente, caja, estado_pedido, nota_entrega, empleado, hora_entregando) VALUES ("${a}","${a}",1,"ENTREGANDO",null,11111111,"${b}");`
  db.query(query, function(err, data) {
    if(err)
      res.send(err);
    else
    res.send(data);
  })
});

router.post('/registro', function (req, res, next) {
  const jsonData = {
    cliente: req.body.cliente,
    pedido: req.body.pedido,
    fila: req.body.fila,
    fecha: req.body.fecha
  }
  console.log(jsonData)
  let query = `INSERT INTO BITACORA (nombre_cliente, pedido_cliente, caja, estado_pedido, nota_entrega, empleado, hora_entregando) VALUES ("${req.body.cliente}","${req.body.pedido}",${req.body.fila},"ENTREGANDO",null,11111111,"${req.body.fecha}");
                `;
  db.query(query, function (err, data) {
    if (err)
    res.send(err)
     /* res.status(500).send({
        error: true,
        msg: "Ocurrio un error al registrar el pedido "
      });*/
    else
      socketapi.io.emit('json', jsonData);
      res.send({
        succes:true,
        msg: 'Pedido registrado correctamente'
      })
  });

});

module.exports = router;
