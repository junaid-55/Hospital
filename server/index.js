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
app.use("/doctorhome",require("./routes/DoctorHome"));
app.use('/bill',require('./routes/Bill'));
app.use('/drug-administration',require('./routes/Admin/DrugAdminstration'));
app.use('/lab-test-administration',require('./routes/Admin/LabTestAdminstration.JS'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log("server is listening");
})