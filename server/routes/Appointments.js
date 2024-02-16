const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.post("", authorization, async (req, res) => {
  try {
    console.log("request coming from /appointments");
    const person_id = req.user;
    const type = 'consultation';
    const {doctor} = req.body;
    const patient = await pool.query(
      "INSERT INTO appointment (name,person_id,doctor_id,contact_no,appointment_date,type) VALUES ((SELECT name FROM person where person_id = $1),$2,$3,$4,$5,$6) RETURNING *;",
      [person_id,person_id, doctor.doctor_id,doctor.contact_no, new Date(), type]
    );

    console.log(patient);
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
        "SELECT D.name doctor_name,A.type type,A.appointment_date date, A.contact_no contact_no  FROM appointment A JOIN doctor D USING(doctor_id) WHERE person_id = $1;",
        [id]
      );
      return res.json(appointments.rows);
    }

    return res.status(500).send("My fault");
  } catch (err) {
    console.error();
  }
});

module.exports = router;
