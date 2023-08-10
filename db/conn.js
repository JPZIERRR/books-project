const mysql = require('mysql');

const pool = mysql.createPool({
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
});

console.log();

pool.getConnection((err, conn) => {
  if (err) {
    console.log(err);
  }

  console.log(`Banco conectado`);
});

module.exports = pool;
