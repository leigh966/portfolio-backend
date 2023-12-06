
// Importing express module 
const express = require("express") 
const app = express() 

app.use(express.json());
require('dotenv').config()
const sanitizer = require('sanitize');
app.use(sanitizer.middleware);

// SANITIZE INPUT!!!!
app.delete('/project/:id', (req, res) => {
	const pgClient = require("./postgres_client").client;
	if(!verify.sessionId(req.headers.session_id))
	{
		res.status(401);
		res.send("Authentication Failed")
		return;
	}
	const json = req.body;
	const query = `DELETE FROM projects WHERE id=${req.paramInt("id")} RETURNING *`
	pgClient.query(query).then((dbRes)=>
	{
		res.status(204);
		res.send("Done");
	})
})

// SANITIZE INPUT!!!!
app.put('/project/:id', (req, res) => {
	const pgClient = require("./postgres_client").client;
	const name = req.bodyString("name")
	console.log(name);
	if(!verify.sessionId(req.headers.session_id))
	{
		res.status(401);
		res.send("Authentication Failed")
		return;
	}
	const json = req.body;
	const query = `UPDATE projects SET name='${json.name}', description='${json.description}', last_updated=now() WHERE id=${req.paramInt("id")} RETURNING *`
	pgClient.query(query).then((dbRes)=>
	{
		id = dbRes.rows[0].id;
		if(id)
		{
			res.status(200);
			res.send(dbRes.rows[0]);
			return;
		}
		res.status(500);
		res.send("Error writing to db");
	})
})

app.get('/projects', (req, res) => {
	const pgClient = require("./postgres_client").client;
	if(!verify.sessionId(req.headers.session_id))
	{
		res.status(401);
		res.send("Authentication Failed")
		return;
	}
	pgClient.query("SELECT * FROM projects").then((dbRes)=>
		{
			var id;
			try
			{
				id = dbRes.rows[0].id;
			}
			catch
			{
				id = null;
			}
			
			if(id)
			{
				res.status(200);
				res.send(dbRes.rows);
				return;
			}
			res.status(200);
			res.send("[]");
		}
	)
})

// SANITIZE INPUT!!!!
app.post('/project',(req, res) => {
	const pgClient = require("./postgres_client").client;
	const json = req.body;
	if(!verify.sessionId(req.headers.session_id))
	{
		res.status(401);
		res.send("Authentication Failed")
		return;
	}
	const text = 'INSERT INTO projects(name, description) VALUES($1, $2) RETURNING *'
	const values = [json.name, json.description]

	pgClient.query(text, values).then((dbRes) =>
		{
			id = dbRes.rows[0].id;
			if(id)
			{
				res.status(201);
				res.send(dbRes.rows[0]);
				return;
			}
			res.status(500);
			res.send("Error writing to db");
		}
	);

})


const verify = require("./verify");
const { Console } = require("console");
const { client } = require("./postgres_client");
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
app.listen(process.env.PORT, () => { 
    console.log("Server is Running") 
}) 