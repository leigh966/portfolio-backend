
// Importing express module 
const express = require("express") 
const app = express() 

app.use(express.json());
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


var sessionId = null;



const verify = require("./verify");
const { Console } = require("console");
app.post('/login', (req, res) => {
	const json = req.body;
	const passwordCorrect = verify.password(json.password, process.env.SALT, process.env.PASSWORD_HASH);
	const otpCorrect = verify.otp(json.otp);
	if(passwordCorrect && otpCorrect)
	{
		res.status(201)
		verify.createSession(res);
		return;
	}
	res.status(401)
	res.send("Failed To Authenticate")
  });
  


// Server setup 
app.listen(3000, () => { 
    console.log("Server is Running") 
}) 