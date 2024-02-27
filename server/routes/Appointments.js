const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.post("", authorization, async (req, res) => {
  try {
    console.log("request coming from /appointments");
    const patient_id = req.user;
    const type = "consultation";
    const { doctor,appointment_date} = req.body;
    const patient = await pool.query(
      "INSERT INTO appointment (doctor_id,patient_id,type,contact_no,appointment_date) VALUES ($1,$2,$3,$4,$5) RETURNING *;",
      [doctor.doctor_id, patient_id, type, doctor.contact_no, new Date(appointment_date)]
    );
    console.log(patient.rows[0]);
    return res.json(patient.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

router.get("", authorization, async (req, res) => {
  try {
    console.log("request coming from /appointments");
    const id = req.user;
    const { "request-type": type } = req.headers;
    console.log(type, id);
    if (type === "all_appointment") {
      const appointments = await pool.query(
        "SELECT distinct (D.first_name||' '|| D.last_name) doctor_name,A.appointment_id appointment_id,A.type type,A.appointment_date date, A.contact_no contact_no, A.status status  FROM appointment A JOIN doctor D USING(doctor_id) WHERE patient_id = $1;",
        [id]
      );
      console.log(appointments.rows);
      return res.json(appointments.rows);
    }

    return res.status(500).send("My fault");
  } catch (err) {
    console.error();
  }
});

router.get("/:appointment_id", authorization, async (req, res) => {
  try {
    console.log("request coming from /appointments/:appointment_id");
    const { appointment_id } = req.params;
    const type = req.headers.type;
    console.log(appointment_id);
    const appointment = await pool.query(
      `SELECT  (D.first_name ||' '||D.last_name) doctor_name,
      D.email doctor_email,
      A.type appointment_type,
      (P.first_name ||' '||P.last_name) patient_name,
      A.appointment_date date,
      A.contact_no contact_no 
      FROM appointment A 
      JOIN doctor D ON A.doctor_id = D.doctor_id 
      JOIN patient P on P.patient_id = A.patient_id 
      WHERE appointment_id = $1;`, [appointment_id]
    );
    console.log(appointment.rows[0]);
    return res.json(appointment.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;