const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());


app.use("/auth", require("./routes/jwtauth"));
app.use("/userhome/",require("./routes/UserHome"));



const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log("server is listening");
})