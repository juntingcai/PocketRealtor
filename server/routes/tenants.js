var express = require("express");
var router = express.Router();
const Tenant = require("../controllers/tenantController");
const User = require("../controllers/userController");
const TenantGroup = require("../controllers/groupController");
// router.get('/user/:userId/', User.getUserProfile)
router.put(
  "/tenant/preference/:zip",
  User.verifyToken,
  Tenant.verifyTenantRole,
  Tenant.addTenantZipPreference
);

router.put(
  "/tenant/preference/",
  User.verifyToken,
  Tenant.verifyTenantRole,
  Tenant.addCityPreference
);

router.post(
  "/tenant/preference/update",
  User.verifyToken,
  Tenant.verifyTenantRole,
  Tenant.updateTenantPreference
);

router.get("/tenant/preference/:userId", Tenant.getTenantPreference);

router.get("/tenants", Tenant.searchTenants);

router.put(
  "/tenant/favorite/:listingId",
  User.verifyToken,
  Tenant.verifyTenantRole,
  Tenant.addListingToFavorite
);
router.delete(
  "/tenant/favorite/:listingId",
  User.verifyToken,
  Tenant.verifyTenantRole,
  Tenant.deleteOneFavoriteListing
);

router.get(
  "/tenant/favorite/",
  User.verifyToken,
  Tenant.verifyTenantRole,
  Tenant.getFavoriteListings
);

router.get(
  "/tenant/favorite/:userId",
  User.verifyToken,
  Tenant.getFavoriteListings
);

//=======================group operation=====================
router.post(
  "/tenant/group/create",
  User.verifyToken,
  Tenant.verifyTenantRole,
  TenantGroup.createGroup
);

router.put(
  "/tenant/group/update",
  User.verifyToken,
  Tenant.verifyTenantRole,
  TenantGroup.updateGroup
);

router.delete(
  "/tenant/group/delete/:id",
  User.verifyToken,
  Tenant.verifyTenantRole,
  TenantGroup.deleteGroup
);

router.get("/tenant/group/:id", User.interpretToken, TenantGroup.getGroup);

router.post(
  "/tenant/group/invite/",
  User.verifyToken,
  Tenant.verifyTenantRole,
  TenantGroup.inviteTenant
);

router.put(
  "/tenant/group/invite/accept/:groupId",
  User.verifyToken,
  Tenant.verifyTenantRole,
  TenantGroup.acceptInvitation
);

router.put(
  "/tenant/group/invite/reject/:groupId",
  User.verifyToken,
  Tenant.verifyTenantRole,
  TenantGroup.rejectInvitation
);

router.post(
  "/tenant/group/apply/:groupId",
  User.verifyToken,
  Tenant.verifyTenantRole,
  TenantGroup.applyGroup
);

router.put(
  "/tenant/group/apply/respond/",
  User.verifyToken,
  Tenant.verifyTenantRole,
  TenantGroup.respondApplication
);

router.get(
  "/tenant/group/waiting/:groupId",
  User.verifyToken,
  Tenant.verifyTenantRole,
  TenantGroup.getWaitingTenants
);

router.get(
  "/tenant/group/applied/list",
  User.verifyToken,
  Tenant.verifyTenantRole,
  TenantGroup.getApplyingGroups
);

router.delete(
  "/tenant/group/applied/cancel/:groupId",
  User.verifyToken,
  Tenant.verifyTenantRole,
  TenantGroup.cancelApplication
);

router.put(
  "/tenant/group/notes/put/:groupId",
  User.verifyToken,
  Tenant.verifyTenantRole,
  TenantGroup.putMessage
);

router.get("/test", Tenant.test);

module.exports = router;
