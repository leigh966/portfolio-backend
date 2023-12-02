require('dotenv').config()


// Connect to postgres db
const pg = require("pg");
const pgClient = new pg.Client({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT,
});
pgClient.connect();
require("./setup_table").setup(pgClient);
module.exports.client = pgClient;