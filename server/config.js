module.exports = {
  http_port: 80,
  https_listenPort: 443,
  alterTables: false,
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
};
