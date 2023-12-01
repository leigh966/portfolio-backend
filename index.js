
// Importing express module 
const express = require("express") 
const app = express() 

app.use(express.json());

// Including crypto module
const crypto = require('crypto');

var sessionId = null;


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
	if(json.password == "password")
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