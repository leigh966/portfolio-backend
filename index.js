
// Importing express module 
const express = require("express") 
const app = express() 
  
// Handling GET / request 
app.use("/", (req, res, next) => { 
    res.send("Hello World") 
}) 
  
// Server setup 
app.listen(3000, () => { 
    console.log("Server is Running") 
}) 