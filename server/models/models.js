const { DataTypes } = require("sequelize");
const sequelize = require("../database/dbConnection");
const config = require("../config");
const permissionType = require("../static/PermissionType");
const roleType = require("../static/RoleType");

// Models Import
const User = require("./users")(sequelize, DataTypes);
const UsZipCode = require("./usZipCodes")(sequelize, DataTypes);
const TenantZipPreference = require("./tenantZipPreferences")(
  sequelize,
  DataTypes
);
const Role = require("./roles")(sequelize, DataTypes);
const UserRole = require("./userRoles")(sequelize, DataTypes);
const Permission = require("./permissions")(sequelize, DataTypes);
const RolePermission = require("./rolePermissions")(sequelize, DataTypes);
const Listing = require("./listings")(sequelize, DataTypes);
const FavoriteListing = require("./favariteListings")(sequelize, DataTypes);
const TenantHistory = require("./tenantHistory")(sequelize, DataTypes);
const TenantGroups = require("./tenantGroups")(sequelize, DataTypes);
const GroupMembers = require("./groupMembers")(sequelize, DataTypes);
const TenantGroupListings = require("./tenantGroupListings")(sequelize, DataTypes);


// associate user and zip codes into TenantZipPreference
User.belongsToMany(UsZipCode, {
  through: TenantZipPreference,
  foreignKey: "user_id",
});
UsZipCode.belongsToMany(User, {
  through: TenantZipPreference,
  foreignKey: "zip_code",
});

// associate user and role into UserRole
User.belongsToMany(Role, { through: UserRole, foreignKey: "user_id" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id" });

// assciate role and its permission into RolePermission
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permission_id",
});
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "role_id",
});

// associate user and listings
User.hasMany(Listing, { foreignKey: "owner_id" });
Listing.belongsTo(User, { foreignKey: "owner_id" });

// associate user and listings to FavoriteListing
User.belongsToMany(Listing, {
  through: FavoriteListing,
  foreignKey: "user_id",
});
Listing.belongsToMany(User, {
  through: FavoriteListing,
  foreignKey: "listing_id",
});

// user has one TenantGroups

User.hasMany(TenantGroups, { foreignKey: "owner_id" });
TenantGroups.belongsTo(User, { foreignKey: "owner_id" });

// set up TenantGroups
TenantGroups.belongsToMany(User, {
  through: GroupMembers,
  foreignKey: "group_id",
});
User.belongsToMany(TenantGroups, {
  through: GroupMembers,
  foreignKey: "user_id",  
});


Listing.belongsToMany(TenantGroups, {through: TenantGroupListings, foreignKey: "listing_id"});
TenantGroups.belongsToMany(Listing, {through: TenantGroupListings, foreignKey: "group_id"})


sequelize.sync({ alter: true }).then(() => {
  if (config.resetTables) {
    Role.bulkCreate([roleType.RENTER, roleType.HOST, roleType.AGENT]);

    Permission.bulkCreate([
      permissionType.CREATE_LISTING,
      permissionType.MESSAGE_HOST,
      permissionType.MESSAGE_RENTER,
    ]);
  }
});

module.exports = {
  User,
  UserRole,
  Role,
  Listing,
  TenantZipPreference,
  UsZipCode,
  FavoriteListing,
  TenantHistory,
  TenantGroups,
  GroupMembers,
  TenantGroupListings
};
