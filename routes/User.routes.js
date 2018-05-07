var router = require('express').Router();
var userDAO = require('../dao/User.dao');

module.exports = function () {
    router.post('/verify', verify);
    router.post('/transfer', transfer);
    function verify(req, res, next) {
        var user = req.body;
        userDAO.verify(user.id, user.pin, user.email, user.ten, user.sdt, user.dia_chi, function (err, response) {
            if (err) next(err);
            else res.send(response);
        });
    }

    // function transfer(req, res, next) {
    //     var transaction = req.body;
    //     userDAO.transfer(transaction.id, transaction.so_tien, transaction.pin, transaction.receiver_id, function (err, response) {
    //         if (err) next(err);
    //         else res.send(response);
    //     });
    // }

    function transfer(req, res, next) {
        var transaction = req.body;
        userDAO.verify(transaction.id, transaction.pin, transaction.email, transaction.ten, transaction.sdt, transaction.dia_chi, function (err, response) {
            if (err) next(err);
            else if (response[0].dataValues.no_user > 0) {
                userDAO.transfer(transaction.id, transaction.so_tien, transaction.pin, transaction.receiver_id, function (err, response) {
                    if (err) next(err);
                    else res.send(response);
                });
            } else {
                res.send('wrong information');
            }
        });

    }

    return router;
};

