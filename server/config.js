module.exports = {
  resetTables: false, // This will clean up all tables data
  alterTables: true,
  http: {
    enable: true,
    port: 80,
  },
  https: {
    enable: false,
    port: 443,
    privary_key_pem: "",
    cert_pem: "",
    chain_pem: "",
  },
  token_expire : "3d",
};
