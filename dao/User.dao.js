var User = require('../modal/User');
var han_muc = require('../config/dbconfig').han_muc;
var sequelize = require('sequelize');

module.exports = {
    verify: verify,
    transfer: transfer
};

function verify(id, pin, email, ten, sdt, dia_chi, callback) {
    User.findAll({
        attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'no_user']],
        where: {
            id: id,
            pin: pin,
            email: email,
            ten: ten,
            sdt: sdt,
            dia_chi: dia_chi
        }
    }).then(function (no_user) {
        callback(null, no_user);
    });
}

function transfer(nguoi_gui, so_tien, pin, nguoi_nhan, callback) {
    console.log(so_tien);
    if (so_tien > han_muc) {
        callback(null, 'too_much');
    }
    User.findAll({
        attributes: ['so_tien'],
        where: {
            id: nguoi_gui,
            pin: pin
        }
    }).then(function (user) {
        console.log(user[0].dataValues.so_tien);
        if (!user[0] || user[0].dataValues.so_tien < so_tien) {
            callback(null, 'not enough');
        } else {
            User.update({
                so_tien: sequelize.literal('so_tien -' + so_tien),
            }, {
                    where: {
                        id: nguoi_gui
                    }
                }).then(function () {
                    User.update({
                        so_tien: sequelize.literal('so_tien + ' + so_tien),
                    }, {
                            where: {
                                id: nguoi_nhan
                            }
                        });
                }).then(function () {
                    callback(null, 'success');
                });
        }
    });
}