var express = require('express');
var router = express.Router();
var socketapi = require("../socket");
var db = require("../utils/db_utils")

router.get('/form', function (req, res, next) {
  if (req.session.it)
    res.render('user', {
      title: 'Liverpool',
      empleado: {
        nombre: req.session.nombre,
        id: req.session.id
      }, flag: 'A'
    });
  else
    res.render('user', { title: 'Liverpool', flag: 'L' });
});

/*router.get('/db', function (req, res, next) {
  var a = "Naamr"
  var b = new Date().toISOString().slice(0, 19).replace('T', ' ');
  var query = `INSERT INTO bitacora (nombre_cliente, pedido_cliente, caja, estado_pedido, nota_entrega, empleado, hora_entregando) VALUES ("${a}","${a}",1,"ENTREGANDO",null,11111111,"${b}");`
  db.query(query, function (err, data) {
    if (err)
      res.send(err);
    else
      res.send(data);
  })
});*/


router.post('/registro', function (req, res, next) {
  const jsonData = {
    cliente: req.session.nombre,
    pedido: req.body.pedido,
    fila: req.body.fila,
    fecha: req.body.fecha
  }
  console.log(jsonData)
  let query = `INSERT INTO bitacora (nombre_cliente, pedido_cliente, caja, estado_pedido, nota_entrega, empleado, hora_entregando) VALUES ("${req.body.cliente}","${req.body.pedido}",${req.body.fila},"ENTREGANDO",null,${req.session.matricula},"${req.body.fecha}");
                `;
  db.query(query, function (err, data) {
    console.log(err)
    console.log(data)
    if (err) {
      if(err.code == 'ER_DUP_ENTRY'){
        return res.status(500).send({
          error: true,
          msg: "PEDIDO DUPLICADO! Este pedido ya ha sido entregado."
        })
      }else{
        return res.status(500).send({
          error: true,
          msg: "Ocurrio un error al registrar el pedido "
        })
      }
      
    }
    else
      socketapi.io.emit('json', jsonData);
    res.send({
      succes: true,
      msg: 'Pedido registrado correctamente'
    })
  });

});

router.post('/libera', function (req, res, next) {

  let query = `UPDATE bitacora SET estado_pedido="ENTREGADO", nota_entrega="${req.body.nota}", hora_entregado="${req.body.fecha}" WHERE pedido_cliente = "${req.body.pedido}";
    `;
  db.query(query, function (err, data) {
    if (err) {
      res.send({
        error: true,
        msg: "Ocurrio un error al liberar el pedido "
      })
    }
    else{
      console.log(data)
      res.send({
        succes: true,
        msg: 'Pedido liberado correctamente'
      })
    }
    
  });

});

router.post('/login', (req, res) => {
  console.log(req.body.matricula)
  console.log(req.body.contrasena)
  if (req.body.matricula && req.body.contrasena) {
    var matricula = req.body.matricula;
    var contrasena = req.body.contrasena;
    let query = `
            SELECT id, nombre, pass FROM acceso WHERE baja = 0 AND id = ${matricula}`;

    db.query(query, function (err, data) {
      if (err)
        res.send({
          error: true,
          msg: "Ocurrio un error al iniciar sesion"
        })
      else if (data.length > 0) {
        for (let index = 0; index < data.length; index++) {
          if (data[index].pass == contrasena) {
            console.log(data[index])
            req.session.matricula = matricula
            req.session.nombre = data[index].nombre
            req.session.it = true
            console.log(req.session)
           // res.redirect("form")
          }
        }
      }
      if(req.session.it){
        res.send({ redirect: '/form' })
      }else{
        res.send({
          error: true,
          msg: "Credenciales invalidas!"
        })
      }
    });
  } 
});

router.get('/logout', (req, res) => {
  // Cerrar sesión y redirigir a la página de inicio
  req.session.destroy(err => {
    if (err) {
      console.error(err);
    }
    res.redirect('/form');
  });
});

module.exports = router;
