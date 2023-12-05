require('dotenv').config()

function getClient()
{
// Connect to postgres db
const pg = require("pg");
const pgClient = new pg.Client(process.env.PGDATABASE);
pgClient.connect();
//require("./setup_table").setup(pgClient);
return pgClient;
}
module.exports.client = getClient();