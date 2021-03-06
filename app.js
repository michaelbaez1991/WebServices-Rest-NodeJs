var express = require('express')
const oApp = express()
const port = 3000
const mysql = require('mysql');

oApp.use(express.json()); 
oApp.use(express.urlencoded({ extended: false }));

// CONFIGURACION PARA CONEXION A LA BASE DE DATOS
const oMyConnection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'db_gatos'   
});

// LISTAR REGISTROS
oApp.get('/gato', function(oReq, oRes) {
    var sSQLGetAll = "SELECT * FROM gatos";
    oMyConnection.query(sSQLGetAll, function(oError, oRows, oCols) {
        if(oError) {
            oRes.write(JSON.stringify({
                error: true,
                error_object: oError         
            }));
            oRes.end();
        } else {
            oRes.write(JSON.stringify(oRows));
            oRes.end();       
        }
    });
});   

// CREAR REGISTRO
oApp.post('/gato', function (req, res) {
  var oDataOP = {};  
  oDataOP = req.body;

  var sSQLCreate = "INSERT INTO gatos (nombre, raza, color, edad, peso) VALUES (";
    sSQLCreate += "'" + oDataOP.nombre + "', ";
    sSQLCreate += "'" + oDataOP.raza + "', ";
    sSQLCreate += "'" + oDataOP.color + "', ";
    sSQLCreate += "'" + oDataOP.edad + "', ";
    sSQLCreate += "'" + oDataOP.peso + "')";
      
    oMyConnection.query(sSQLCreate, function(oError, oRows, oCols) {
        if(oError) {
            res.write(JSON.stringify({
                error: true,
                error_object: oError
            }));
            res.end();      
        } else {
            var iIDCreated = oRows.insertId;
            res.write(JSON.stringify({
                error: false,
                idCreated: iIDCreated
            }));
            res.end();      
        }    
    });  
});

// EDITAR REGISTRO
oApp.put('/gato', function (req, res) {
  var oDataOP = {};  
  oDataOP = req.body;

  var sSQLUpdate = "UPDATE gatos SET ";
  if(oDataOP.hasOwnProperty('nombre')) {
    sSQLUpdate += "nombre = '" + oDataOP.nombre + "' ";
  }

  if(oDataOP.hasOwnProperty('raza')) {
    sSQLUpdate += ", raza = '" + oDataOP.raza + "' ";
  }

  if(oDataOP.hasOwnProperty('color')) {
    sSQLUpdate += ", color = '" + oDataOP.color + "' ";
  }

  if(oDataOP.hasOwnProperty('edad')) {
    sSQLUpdate += ", edad = " + oDataOP.edad + " ";
  }

  if(oDataOP.hasOwnProperty('peso')) {
    sSQLUpdate += ", peso = " + oDataOP.peso + " ";    
  }   

  sSQLUpdate += " WHERE id_gato = " + oDataOP.idgato;
  
  oMyConnection.query(sSQLUpdate, function(oErrUpdate, oRowsUpdate, oColsUpdate) {
    if(oErrUpdate) {
      res.write(JSON.stringify({ 
        error: true,
        error_object: oErrUpdate
      }));
      res.end();      
    } else {
      res.write(JSON.stringify({
        error: false
      }));
      res.end();
    }
  });
});  

// ELIMINAR REGISTRO
oApp.delete('/gato', function (req, res) {
  oDataOP = req.body;

  var sSQLDelete = "DELETE FROM gatos WHERE id_gato = " + oDataOP.idgato;
  oMyConnection.query(sSQLDelete, function(oErrDelete, oRowsDelete, oColsDelete) {
    if(oErrDelete) {
      res.write(JSON.stringify({
        error: true,
        error_object: oErrDelete
      }));
      res.end();
    } else {
      res.write(JSON.stringify({
        error: false
      }));
      res.end();      
    }    
  });  
});

// ALL METHOD REQUEST GET - POST - PUT - DELETE
oApp.all('/gatos', function (req, res, next) {
  var oDataOP = {};  
  oDataOP = req.body;

  switch (req.method) {
    case 'GET':
      var sSQLGetAll = "SELECT * FROM gatos";
      oMyConnection.query(sSQLGetAll, function (error, results, fields) {
        if (error) throw error;
        res.write(JSON.stringify(results));
        res.end();
      });
      break;

    case 'POST':
      var sSQLCreate = "INSERT INTO gatos (nombre, raza, color, edad, peso) VALUES (";
        sSQLCreate += "'" + oDataOP.nombre + "', ";
        sSQLCreate += "'" + oDataOP.raza + "', ";
        sSQLCreate += "'" + oDataOP.color + "', ";
        sSQLCreate += "'" + oDataOP.edad + "', ";
        sSQLCreate += "'" + oDataOP.peso + "')";
          
        oMyConnection.query(sSQLCreate, function (error, results, fields) {
          if (error) throw error;
          var iIDCreated = results.insertId;
          res.write(JSON.stringify({
            error: false,
            idCreated: iIDCreated
          }));
          res.end();
        });  
      break;
    
    case 'PUT':
      var sSQLUpdate = "UPDATE gatos SET ";
      if(oDataOP.hasOwnProperty('nombre')) {
        sSQLUpdate += "nombre = '" + oDataOP.nombre + "' ";
      }

      if(oDataOP.hasOwnProperty('raza')) {
        sSQLUpdate += ", raza = '" + oDataOP.raza + "' ";
      }

      if(oDataOP.hasOwnProperty('color')) {
        sSQLUpdate += ", color = '" + oDataOP.color + "' ";
      }

      if(oDataOP.hasOwnProperty('edad')) {
        sSQLUpdate += ", edad = " + oDataOP.edad + " ";
      }

      if(oDataOP.hasOwnProperty('peso')) {
        sSQLUpdate += ", peso = " + oDataOP.peso + " ";    
      }   

      sSQLUpdate += " WHERE id_gato = " + oDataOP.idgato;
      oMyConnection.query(sSQLUpdate, function (error, results, fields)  {
        if (error) throw error; 
        // res.write(JSON.stringify(results));
        res.write(JSON.stringify({
          error: false,
          result: results
        }));
        res.end();
      });
      break;
    
    case 'DELETE':
      var sSQLDelete = "DELETE FROM gatos WHERE id_gato = " + oDataOP.idgato;
      oMyConnection.query(sSQLDelete, function (error, results, fields) {
        if (error) throw error;
        res.write(JSON.stringify({
          error: false,
          result: results
        }));
        res.end();      
      });  
      break;
    
    default:
      res.write(JSON.stringify({ 
        error: true, 
        error_message: 'Debes proveer una operación correcta' 
      }));
      res.end();
      break;
  }
  // next(); // pass control to the next handler
});

// PUERTO ESCUCHA DE LA APP
oApp.listen(port, function(oReq, oRes) {
  console.log("Servicios web gestión entidad GATO activo, en puerto 3000");   
});