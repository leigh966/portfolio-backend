
// Importing express module 
const express = require("express") 
const app = express() 

app.use(express.json());


app.post('/login', (req, res) => {
	const json = req.body;
	if(json.password == "password")
	{
		res.status(201)
		res.send("Logged In")
		return;
	}
	res.status(401)
	res.send("Incorrect Password")
  });
  
// Server setup 
app.listen(3000, () => { 
    console.log("Server is Running") 
}) 