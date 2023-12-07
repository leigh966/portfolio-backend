
// Importing express module 
const express = require("express") 
const app = express() 

app.use(express.json());
require('dotenv').config()
const sanitizer = require('sanitize');
app.use(sanitizer.middleware);
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

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

function restoreDangerousCharacters(s)
{
	const list = s.split("#");
	let output = ""
	for(let i = 0; i < list.length; i++)
	{
		if(i%2==1)
		{
			output+=String.fromCharCode(list[i])
		}
		else
		{
			output+=list[i];
		}
	}
	console.log(output);
	return output;
}

app.delete('/project/:id', (req, res) => {
	const pgClient = require("./postgres_client").getClient();
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
	const pgClient = require("./postgres_client").getClient();
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
		if(dbRes.rows.length>0)
		{
			res.status(200);
			res.send(dbRes.rows[0]);
			return;
		}
		res.status(500);
		res.send("Error writing to db - is your id correct?");
	})
})

app.get('/projects', (req, res) => {
	const pgClient = require("./postgres_client").getClient();
	pgClient.query("SELECT * FROM projects").then((dbRes)=>
		{

				output = []
				for(let i = 0; i<dbRes.rows.length;i++)
				{
					let outputRow = {};
					outputRow.name = restoreDangerousCharacters(dbRes.rows[i].name);
					outputRow.description = restoreDangerousCharacters(dbRes.rows[i].description)
					outputRow.last_updated = dbRes.rows[i].last_updated
					output.push(outputRow);
				}
				res.status(200);
				res.send(JSON.stringify(output));
				return;

		}
	)
})

app.post('/project',(req, res) => {
	const pgClient = require("./postgres_client").getClient();
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
			if(dbRes.rows.length>0)
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