const dbConfig = require('../database/config.js');
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(function (err) {
    console.log("Connection has been established successfully.");
  })
  .catch(function (err) {
    console.log("Unable to connect to the database:", err);
  });


var User = sequelize.define('user',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password_salt: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password_hashed: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    // tokens: {
    //   type: Sequelize.ARRAY(Sequelize.TEXT),
    //   allowNull: true,
    // },
  },
  {
    underscored: true,
    timestamps: false,
    //freezeTableName: false
  }
);

// User.sync({ force: true });

sequelize.sync();

class UserDbModel{
  async createUser(user) {
    return await User.create(user);
  }

  async findUserByEmail(email){
    return await User.findOne({ where: { email: email } });
  }

  async findUserById(id){
    return await User.findOne({ where: { id: id } });
  }

  // appendToken(userId, token){
  //   User.update(
  //     {'tokens': sequelize.fn('array_append', sequelize.col('tokens'), token)},
  //     {'where': {'id': userId}}
  //    );
  // }
  
}


module.exports = new UserDbModel();
