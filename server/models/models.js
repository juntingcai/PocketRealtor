const { DataTypes } = require("sequelize");
const sequelize = require("../database/dbConnection");

let tableDefaultSetting = {
  underscored: true,
  timestamps: false,
  freezeTableName: true,
};

const User = sequelize.define(
  "users",
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
  tableDefaultSetting
);

const Role = sequelize.define(
  "roles",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  tableDefaultSetting
);

const UserRole = sequelize.define(
  "user_roles", 
  {},
  tableDefaultSetting
);

User.belongsToMany(Role, { through: UserRole , foreignKey: "user_id"});
Role.belongsToMany(User, { through: UserRole , foreignKey: "role_id"});

const Permission = sequelize.define(
  "permissions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  tableDefaultSetting
);

const RolePermission = sequelize.define(
  "role_permissions",
  {},
  tableDefaultSetting
);

Permission.belongsToMany(Role, { through: RolePermission , foreignKey: "permission_id"});
Role.belongsToMany(Permission, { through: RolePermission , foreignKey: "role_id"});

sequelize.sync({force: true}).then(()=>{
  Role.bulkCreate([
    { id: 1, name: "Renter" },
    { id: 2, name: "Host" },
    { id: 3, name: "Agent" },
  ]);
  
  Permission.bulkCreate([
    { id: 1, name: "Create a listing" },
    { id: 2, name: "Message a host" },
    { id: 3, name: "Message a renter" },
  ]);
})



module.exports = { User };
