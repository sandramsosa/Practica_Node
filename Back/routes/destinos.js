var express = require('express');
var router = express.Router();
const connection = require("./../bbdd");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query("select * FROM destinos", function (error, results, fields) {
    if (error) throw error;
console.log(results);
    res.render('index', {data:results});
  });
   
});
/* Dashboard */
router.get('/listado/', function(req, res, next) {

  if(req.query.id){
      sentencia = 'select * from destinos where id = ' +  req.query.id
  } else {
    sentencia = 'select * from destinos' 
  }
  connection.query(sentencia, function (error, results, fields) {

      if (error) throw error;
      // res.json({data: results})
      res.render('listado', {data:results});
    });
});


//alta//
router.get('/alta', function (req, res, next){

  res.render('alta')

})

router.post('/alta',  upload.single('imagen'), async function (req, res, next){

 let sentencia =`insert into destinos(nombre, descripcion,  imagen) values('${req.body.nombre}','${req.body.descripcion}','/images/${req.file.originalname}')`
  
  let results = await connection.query(sentencia)

  fs.createReadStream("./uploads/" + req.file.filename).pipe(fs.createWriteStream("./public/images/" + req.file.originalname), function(error){})

  res.render("finalizado", {mensaje: "Destino Ingresado Exitosamente"})

})

//modificar//
router.get('/modificar/:id', function (req, res, next){

  connection.query('select * from destinos where id = ' + req.params.id, function (error, results, fields) {

    if (error) throw error;
    // res.json({data: results})
    res.render('modificar', {data:results});
  });
})


router.post('/modificar/:id',  upload.single('imagen'), async function (req, res, next){

  let sentencia;

  if (req.file){
    sentencia =  `update destinos set nombre  = '${req.body.nombre}', descripcion  = '${req.body.descripcion}', imagen = '/images/${req.file.originalname}' 
     where id = ${req.params.id} `

     fs.createReadStream("./uploads/" + req.file.filename).pipe(fs.createWriteStream("./public/images/" + req.file.originalname), function(error){})

  } else {
    sentencia = `update destinos set nombre  = '${req.body.nombre}', descripcion  = '${req.body.descripcion}' where id = ${req.params.id}` 
  }  

  connection.query(sentencia, function (error, results, fields) {

    if (error) throw error;
    // res.json({data: results})
    res.render('finalizado', {mensaje:"El destino fue modificado exitosamente"});
  });
  

})

//eliminar//
router.get('/eliminar/:id', function (req, res, next){

  connection.query('select * from destinos where id = ' + req.params.id, function (error, results, fields) {

    if (error) throw error;
    // res.json({data: results})
    res.render('eliminar', {data:results});
  });
})

router.post('/eliminar/:id', function (req, res, next){

  connection.query('delete from destinos where id = ' + req.params.id, function (error, results, fields) {

    if (error) throw error;
    // res.json({data: results})
    res.render('finalizado', {mensaje:"El destino fue eliminado exitosamente"});
  });
})


module.exports = router;