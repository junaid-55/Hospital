const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());


app.use("/auth", require("./routes/jwtauth"));
app.use("/surgeries/",require("./routes/surgery"));
app.use("/userhome/",require("./routes/UserHome"));
app.use("/tests", require('./routes/LabTest'));
app.use("/appointments",require("./routes/Appointments"));
// app.use("/bed_selection", require("./routes/PatientDetails"));
app.use("/doctorhome",require("./routes/DoctorHome"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log("server is listening");
})