const { DataTypes } = require("sequelize");
const sequelize = require("../database/dbConnection");
const config = require("../config");
const permissionType = require("../static/PermissionType");
const roleType = require("../static/RoleType");

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
      type: DataTypes.DATEONLY,
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

const UserRole = sequelize.define("user_roles", {}, tableDefaultSetting);

User.belongsToMany(Role, { through: UserRole, foreignKey: "user_id" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id" });

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

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permission_id",
});
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "role_id",
});

const Listing = sequelize.define(
  "listings",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    introduction: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    zip_code: {
      type: DataTypes.INTEGER(5),
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    rooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    image_links: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
  },
  tableDefaultSetting
);

User.hasMany(Listing, { foreignKey: "owner_id" });
Listing.belongsTo(User, { foreignKey: "owner_id" });

sequelize.sync({ force: config.resetTables }).then(() => {
  if (config.resetTables) {
    Role.bulkCreate([roleType.RENTER, roleType.HOST, roleType.AGENT]);

    Permission.bulkCreate([
      permissionType.CREATE_LISTING,
      permissionType.MESSAGE_HOST,
      permissionType.MESSAGE_RENTER,
    ]);
  }
});

module.exports = { User, UserRole, Role, Listing };
