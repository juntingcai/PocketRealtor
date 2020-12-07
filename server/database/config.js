module.exports = {
  db: "postgres",
  user: "postgres",
  password: "TheAdminPassword",
  host: "pocket-realtor-dev-db.cp3pptnzl7vf.us-west-1.rds.amazonaws.com",
  port: 5432,
  dialect: "postgres",
  pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
  }
}
