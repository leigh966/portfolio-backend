
// Importing express module 
const express = require("express") 
const app = express() 

app.use(express.json());
require('dotenv').config()

// Including crypto module
const crypto = require('crypto');

var sessionId = null;


function comparePassword(password, storedSalt, storedHash) 
{
	const hash = crypto.pbkdf2Sync(password, storedSalt, 1000, 64, `sha512`).toString(`hex`);
    return storedHash === hash;
  }

function generateSessionId(res)
{
	
	// Calling randomBytes method with callback
crypto.randomBytes(127, (err, buf) => {
  if (err) {
    // Prints error
    console.log(err);
    return;
  }
 
  sessionId = buf.toString('hex');
  res.send(sessionId)
});
}

app.post('/login', (req, res) => {
	const json = req.body;
	if(comparePassword(json.password, process.env.SALT, process.env.PASSWORD_HASH))
	{
		res.status(201)
		generateSessionId(res);
		return;
	}
	res.status(401)
	res.send("Incorrect Password")
  });
  
// Server setup 
app.listen(3000, () => { 
    console.log("Server is Running") 
}) 