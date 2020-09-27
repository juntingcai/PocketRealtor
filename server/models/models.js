const { DataTypes } = require("sequelize");
const sequelize = require("../database/dbConnection");

const User = sequelize.define(
  "user_account",
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
    password_salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_hashed: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // ---bio below
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    intro: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    underscored: true,
    timestamps: false,
    freezeTableName: true
  }
);

sequelize.sync();


// TBD:
// Role.hasOne(User);
// User.belongsTo(Role, {foreignKey: 'role_id', defaultValue: 0})
// const Role = sequelize.define(
//   "role",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//     },
//     role_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     underscored: true,
//     timestamps: false,
//   }
// );
// Role.bulkCreate([
//   { id: 0, role_name: "undecided" },
//   { id: 1, role_name: "reanter" },
//   { id: 2, role_name: "host" },
//   { id: 3, role_name: "renter&host" },
//   { id: 4, role_name: "agent" },
// ])


module.exports = {User}