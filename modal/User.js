var sequelize = require('../config/dbconfig').sequelize;
var Sequelize = require('sequelize');

var User = sequelize.define('user', {
  id : {
    type : Sequelize.BIGINT,
    primaryKey: true
  },
  so_tien : {
    type : Sequelize.INTEGER
  },
  email : {
    type : Sequelize.STRING
  },
  ten: {
    type: Sequelize.STRING
  },
  sdt: {
    type: Sequelize.STRING
  },
  dia_chi : {
    type : Sequelize.STRING
  }
});

module.exports = User;