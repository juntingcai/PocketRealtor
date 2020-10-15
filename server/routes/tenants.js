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


router.get(
  "/tenant/preference/:userId",
  Tenant.getTenantPreference
);

router.get(
  "/tenants",
  Tenant.searchTenants
)


router.get(
  "/test",
  Tenant.test
)


module.exports = router;
