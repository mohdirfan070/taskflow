const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const dbName = process.env.DB_NAME || 'taskflow';

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });


  console.log(`Creating database \`${dbName}\` if it doesn't exist...`);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await connection.query(`USE \`${dbName}\``);

  const schemaSql = fs.readFileSync(path.join(__dirname, '..', '..', 'schema.sql'), 'utf8');
  console.log('Applying schema.sql...');
  await connection.query(schemaSql);

  connection.on("connection",()=>{
      console.log("Connected to Database")
  })

  const seedSql = fs.readFileSync(path.join(__dirname, '..', '..', 'seed.sql'), 'utf8');
  console.log('Applying seed.sql...');
  await connection.query(seedSql);

  console.log('Done. Database is ready.');
  await connection.end();
}




main().catch((err) => {
  console.error('Failed to initialize database:', err.message);
  process.exit(1);
});
