const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/dbConnection");

var User = sequelize.define('user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_hashed: {
      type: DataTypes.STRING,
      allowNull: false,
    },
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
  
}


module.exports = new UserDbModel();
