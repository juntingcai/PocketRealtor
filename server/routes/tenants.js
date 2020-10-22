var express = require("express");
var router = express.Router();
const Tenant = require("../controllers/tenantController");
const User = require("../controllers/userController");

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

router.get("/test", Tenant.test);

module.exports = router;
