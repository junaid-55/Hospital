const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.delete("", authorization, async (req, res) => {
  try {
    console.log("request coming from /appointments");
    const { appointment_id } = req.headers;
    const appointment = await pool.query(
      "DELETE FROM appointment WHERE appointment_id = $1 RETURNING *;",
      [appointment_id]
    );
    console.log(appointment.rows[0]);
    return res.json(appointment.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

router.post("", authorization, async (req, res) => {
  try {
    console.log("request coming from /appointments");
    const patient_id = req.user;
    const type = "consultation";
    const { doctor, appointment_date } = req.body;
    const patient = await pool.query(
      "INSERT INTO appointment (doctor_id,patient_id,type,contact_no,appointment_date) VALUES ($1,$2,$3,$4,$5) RETURNING *;",
      [
        doctor.doctor_id,
        patient_id,
        type,
        doctor.contact_no,
        new Date(appointment_date),
      ]
    );
    console.log(patient.rows[0]);
    return res.json(patient.rows[0]);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: err.message });
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
      A.contact_no contact_no,
      PR.patient_type patient_type,
      PR.disease_name diagonosis,
      PR.advice advice
      FROM appointment A 
      JOIN doctor D ON A.doctor_id = D.doctor_id 
      JOIN patient P on P.patient_id = A.patient_id 
      JOIN prescription PR on PR.prescription_id = A.prescription_id
      WHERE appointment_id = $1;`,
      [appointment_id]
    );
    console.log(appointment.rows[0]);
    return res.json(appointment.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

router.get("/prescription/:appointment_id", authorization, async (req, res) => {
  try {
    console.log(
      "request coming from /appointments/prescription/:appointment_id"
    );
    const { appointment_id } = req.params;
    const type = req.headers.type;
    let admit_date, data;
    if (type === "admit_date") {
      admit_date = await pool.query(
        `SELECT admit_date FROM in_patient WHERE appointment_id = $1;`,
        [appointment_id]
      );
      return res.json(admit_date.rows[0]);
    } else if (type === "drugs") {
      console.log("drugs");
      data = await pool.query(
        `SELECT d.name name 
         FROM prescription_drug pd
         JOIN drug d ON pd.drug_id = d.drug_id
         WHERE prescription_id = (SELECT prescription_id FROM appointment WHERE appointment_id = $1);`,
        [appointment_id]
      );
    } else if (type === "labtests") {
      console.log("labtests");
      data = await pool.query(
        `SELECT t.name name FROM prescription_lab pl
         JOIN test t ON pl.test_id = t.test_id
         WHERE prescription_id = (SELECT prescription_id FROM appointment WHERE appointment_id = $1);`,
        [appointment_id]
      );
    }
    console.log(data.rows);
    return res.json(data.rows);
  } catch (err) {
    console.error(err);
  }
});

router.get("/bed_selection/:criteria", authorization, async (req, res) => {
  try {
    const { criteria } = req.params;
    console.log(criteria);
    if (criteria === "bed_types") {
      console.log("request coming from /bed_selection/bed_type");
      const bed_type = await pool.query("SELECT type_name FROM bed_type");
      return res.json(bed_type.rows);
    } else if (criteria === "bed_search") {
      console.log("request coming from /bed_selection/search");
      const body = JSON.parse(req.headers.body);
      let { acType, roomType, minPrice, maxPrice, selectedDate } = body;
      if (!minPrice) minPrice = 0;
      if (!maxPrice) maxPrice = 100000;
      const bed_search = await pool.query(
        `SELECT * FROM bed 
        JOIN bed_type on bed.bed_type_id = bed_type.bed_type_id
         WHERE price BETWEEN $1 AND $2
         AND type_name = $3 AND ac_type = $4 AND is_bed_taken(bed.bed_id) = 0;`,
        [minPrice, maxPrice, roomType, acType]
      );
      return res.json(bed_search.rows);
    } else if (criteria === "bed_details") {
      console.log("request coming from /bed_selection/bed_details");
      const { appointment_id } = req.headers;
      const bed_details = await pool.query(
        `SELECT * FROM bed_taken 
          JOIN bed on bed_taken.bed_id = bed.bed_id
          JOIN bed_type on bed.bed_type_id = bed_type.bed_type_id
          WHERE in_patient_id = (SELECT in_patient_id FROM in_patient WHERE appointment_id = $1);`,
        [appointment_id]
      );
      console.log(bed_details.rows);
      return res.json(bed_details.rows);
    }
  } catch (err) {
    console.error(err.message);
  }
});

router.post(
  "/bed_selection/bed_select/:appointment_id",
  authorization,
  async (req, res) => {
    try {
      console.log(
        "request coming from /bed_selection/bed_select/:appointment_id"
      );
      const { appointment_id } = req.params;
      const { bed_id, occupying_date } = req.body;
      console.log(req.body);
      const bed_select = await pool.query(
        `INSERT INTO bed_taken (bed_id,in_patient_id,cost,occupying_date) 
      VALUES ($1,(SELECT in_patient_id FROM in_patient WHERE appointment_id = $2),
      (SELECT price FROM bed WHERE bed_id = $3),$4) RETURNING *;`,
        [bed_id, appointment_id, bed_id, occupying_date]
      );
      return res.json(bed_select.rows[0]);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
  }
);

// prescription related routes
// router.get("/prescription/:appointment_id", authorization, async (req, res) => {
//   try {
//     console.log(
//       "request coming from /appointments/prescription/:appointment_id"
//     );
//     const { appointment_id } = req.params;
//     const type = req.headers.type;
//     let data;
//     if (type === "drugs") {
//       console.log("drugs");
//       data = await pool.query(
//         `SELECT d.name ||'-'||pd.dosage name 
//          FROM prescription_drug pd
//          JOIN drug d ON pd.drug_id = d.drug_id
//          WHERE prescription_id = (SELECT prescription_id FROM appointment WHERE appointment_id = $1);`,
//         [appointment_id]
//       );
//     } else if (type === "labtests") {
//       console.log("labtests");
//       data = await pool.query(
//         `SELECT t.name name FROM prescription_lab pl
//          JOIN test t ON pl.test_id = t.test_id
//          WHERE prescription_id = (SELECT prescription_id FROM appointment WHERE appointment_id = $1);`,
//         [appointment_id]
//       );
//     }
//     console.log(data.rows);
//     return res.json(data.rows);
//   } catch (err) {
//     console.error(err);
//   }
// });

module.exports = router;
