module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "tenant_group_listings",
    {
      // group id
      // added by
      // listing id
    },
    {
      underscored: true,
      timestamps: true,
      freezeTableName: true,
    }
  );
};
