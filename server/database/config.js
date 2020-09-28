module.exports = {
  db: "jerrydb", // jerrydb
  user: "jerrychen", // jerrychen
  password: "jerry1234", // jerry1234
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
  }
}