var express    = require("express");
var mysql      = require('mysql');
var bodyParser = require('body-parser');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'nganhang'
});
var app = express();
connection.connect(function(err){
    if(err) {
        console.log("Error connecting database ... nn");    
    }
    else {
        console.log("Conect success!")
    }
});
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/bank/verify', function (req,res) {
    let transaction = req.body;
    console.log(transaction);
    let success = true;
    connection.query("SELECT count(id) as count FROM user WHERE id=" + transaction.id + 
                        " and pin=" + transaction.pin + " and email=\'"+ transaction.email +
                        "\' and ten='" + transaction.ten + "\' and sdt=\'" + transaction.sdt +
                        "\' and dia_chi=\'" + transaction.dia_chi + "\'", function (error, results, fields) {
        if(error) {
            res.json({'status':0});
        } else {
            res.json({'status':results[0].count});
        } 
    });
});


app.post('/bank/transfer', function (req,res) {
    let transaction = req.body;
    let success = true;
    let han_muc = 50000000;
    // connection.query("SELECT so_tien FROM user WHERE id=" + transaction.id, function (error, results, fields) {
    //     if(error) {
    //         res.send('fail');
    //         return;
    //     } else {
    //         han_muc = rows;
    //     }
    // });
    // if(transaction.so_tien < han_muc) {
    //     res.send('too_much');
    //     return;
    // }
    connection.query("SELECT so_tien FROM user WHERE id=" + transaction.id, (error, results, fields) => {
        if(error) {
            res.send('fail');
        } else {
            if(fields.so_tien < transaction.so_tien) {
                res.send('not enough');
            }
        }
    });
    connection.beginTransaction((error)=>{
        if(error) {
            throw error;
        }
        connection.query('UPDATE user SET so_tien = so_tien - '+transaction.so_tien+' WHERE id = '+transaction.id+' and pin = '+transaction.pin, function (error, results, fields) {
            if(error) {
                success = false;
                return connection.rollback(()=>{
                    throw error;
                });
            }
            if(results.affectedRows > 0) {
                connection.query('UPDATE user SET so_tien = so_tien + '+transaction.so_tien+' WHERE id = '+transaction.receiver_id, function (error, results, fields) {
                    if(error) {
                        success = false;
                        return connection.rollback(()=>{
                            throw error;
                        });
                    } 
                    if(results.affectedRows === 0) {
                        success = false;
                        return connection.rollback();
                    } else {
                        connection.commit((error)=>{
                            if(error) {
                                success = false;
                                return connection.rollback(()=>{
                                    throw error;
                                });
                            }
                        });
                    }
                });
            } else {
                success = false;
                return connection.rollback();
            }
        });
    });
    if(success)
        res.send('success');
    else
        res.send('fail');
});

app.listen(8080,() => {
    console.log('server start at port 8080');
});