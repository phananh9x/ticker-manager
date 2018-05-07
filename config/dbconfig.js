var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://root:1234@localhost:3306/nganhang');
module.exports = {
    han_muc : 5000000,
    sequelize : sequelize
};