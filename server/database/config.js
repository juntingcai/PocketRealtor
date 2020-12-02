module.exports = {
  db: "postgres",
  user: "postgres",
  password: "TheAdminPassword",
  host: "pocket-realtor-db-dev.cbydt3tkf2qi.us-west-1.rds.amazonaws.com",
  port: 5432,
  dialect: "postgres",
  pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
  }
}
