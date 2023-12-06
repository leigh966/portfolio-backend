
// Importing express module 
const express = require("express") 
const app = express() 

app.use(express.json());
require('dotenv').config()
const sanitizer = require('sanitize');
app.use(sanitizer.middleware);

const lowerCase = "qwertyuiopasdfghjklzxcvbnmm";
const upperCase = lowerCase.toUpperCase();
const allowedCharacters = lowerCase+upperCase+"1234567890"
function removeDangerousCharacters(s)
{
	let output = "";
	for(let i = 0; i < s.length; i++)
	{
		if(!(allowedCharacters.includes(s[i])))
		{
			const replacement = `#${s.charCodeAt(i)}#`
			output+=replacement;
		}
		else{
			output+=s[i];
		}
	}
	return output;
}

app.delete('/project/:id', (req, res) => {
	const pgClient = require("./postgres_client").client;
	if(!verify.sessionId(req.headers.session_id))
	{
		res.status(401);
		res.send("Authentication Failed")
		return;
	}
	const query = `DELETE FROM projects WHERE id=${req.paramInt("id")} RETURNING *`
	pgClient.query(query).then((dbRes)=>
	{
		res.status(204);
		res.send("Done");
	})
})


app.put('/project/:id', (req, res) => {
	const pgClient = require("./postgres_client").client;
	if(!verify.sessionId(req.headers.session_id))
	{
		res.status(401);
		res.send("Authentication Failed")
		return;
	}
	const name = removeDangerousCharacters(req.bodyString("name"))
	const description = removeDangerousCharacters(req.bodyString("description"));
	const query = `UPDATE projects SET name='${name}', description='${description}', last_updated=now() WHERE id=${req.paramInt("id")} RETURNING *`
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
	const values = [removeDangerousCharacters(json.name), removeDangerousCharacters(json.description)]

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
	const otpCorrect = verify.otp(req.bodyInt("otp"));
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