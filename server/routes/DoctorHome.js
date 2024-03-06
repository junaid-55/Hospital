const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("", authorization, async (req, res) => {
  try {
    console.log("request coming from /doctorhome/");
    const {
      headers: { "request-type": type },
    } = req;
    const id = req.user;
    if (type === "user_info") {
      const user = await pool.query(
        ` SELECT first_name,email
          FROM doctor 
          WHERE doctor_id = $1`,
        [id]
      );
      return res.json(user.rows[0]);
    } else {
      const user = await pool.query(
        ` SELECT (first_name||' '||  last_name) Name, email, department_title, title, schedule, experience, consultation_fee , doctor.contact_no
        FROM doctor 
        JOIN department USING(department_id) 
        WHERE doctor_id = $1`,
        [id]
      );
      console.log(user.rows[0]);
      return res.json(user.rows[0]);
    }
  } catch (err) {
    console.log(err.message);
  }
});

// router.post("", async (req, res) => {
//   try {
//     const { "request-type": type, criteria: criteria } = req.headers;
//     if (type && type === "search") {
//       let user;
//       if (criteria === "Name") {
//         console.log("here");
//         const { name } = req.body;
//         user = await pool.query(
//           "SELECT doctor_id, first_name,department_title,experience,schedule,consultation_fee FROM doctor JOIN department USING(department_id) WHERE UPPER(first_name) LIKE $1 ",
//           [`%${name.toUpperCase()}%`]
//         );
//       } else {
//         const { name } = req.body;
//         user = await pool.query(
//           "SELECT doctor_id, first_name,department_title,experience,schedule,consultation_fee FROM doctor JOIN department USING(department_id) WHERE UPPER(department_title) LIKE $1 ",
//           [`%${name.toUpperCase()}%`]
//         );
//       }
//       return res.json(user.rows);
//     }

//     return res.status(500).send("Your fault");
//   } catch (err) {
//     console.log(err.message);
//   }
// });

// router.post("appointment", authorization, async(req, res) =>{
//   try{
//       const [doctor_id,  ]
//   }catch(err)
//   {
//     console.log(err.message);
//   }
// });
router.put("/prescription/:appointmentId", authorization, async (req, res) => {
  try {
    console.log("request coming from /doctorhome/prescription/:appointmentId");
    const { id } = req.params;
    const { disease_name, prescription, appointment_id } = req.body;
    const user = await pool.query(
      "UPDATE appointment SET disease_name = $1, prescription = $2 WHERE appointment_id = $3",
      [disease_name, prescription, appointment_id]
    );
    return res.json(user.rows);
  } catch (err) {
    console.log(err.message);
  }
});
router.get("/drug", async (req, res) => {
  try {
    console.log("request coming from /doctorhome/drug");
    const { "request-type": type } = req.headers;

    const user = await pool.query("SELECT * FROM drug ORDER BY name ASC");
    return res.json(user.rows);
  } catch (err) {
    console.log(err.message);
  }
});
router.get("/test", async (req, res) => {
  try {
    console.log("request coming from /doctorhome/test");
    const { "request-type": type } = req.headers;

    const user = await pool.query("SELECT * FROM test ORDER BY name ASC");
    return res.json(user.rows);
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/surgery", async (req, res) => {
  try {
    console.log("request coming from /doctorhome/surgery");
    const user = await pool.query("SELECT * FROM surgery ORDER BY name ASC");
    return res.json(user.rows);
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/prescription/:appointmentId", async (req, res) => {
  try {
    console.log("request coming from /doctorhome/prescription/:appointmentId");
    const { appointmentId } = req.params;
    const user = await pool.query(
      `SELECT disease_name diseaseName,patient_type patientType, advice FROM prescription 
      WHERE prescription_id = (SELECT prescription_id FROM appointment WHERE appointment_id = $1)`,
      [appointmentId]
    );
    return res.json(user.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//added after checking
router.post("/prescription/:appointmentId", async (req, res) => {
  try {
    console.log("request coming from /doctorhome/prescription/:appointmentId");
    const { appointmentId } = req.params;
    const { diseaseName, patientType, date, advice,admit_date } = req.body;
    console.log(appointmentId, diseaseName, patientType, date, advice);
    const data = await pool.query(
      `CALL insert_into_prescription($3, $2, $4, $5, $1)`,
      [appointmentId, diseaseName, patientType, date, advice]
    );

    console.log("admit_date",admit_date);

    console.log("Coming Here");
    if(admit_date !== undefined)
    {
      await pool.query(
        `CALL insert_into_in_patient($1,$2)`,
        [appointmentId,admit_date]
      );
    }
    console.log("Coming Here Again");
    return res.json(data.rows);
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ error: "An error occurred while updating prescription." });
  }
});


router.get("/prescription_labtest/:appointmentId", async (req, res) => {
  try {
    console.log(
      "request coming from /doctorhome/prescriptionlab/:appointmentId"
    );
    const { appointmentId } = req.params;
    const tests = await pool.query(
      `SELECT test.name name
      FROM prescription_lab
      JOIN test ON prescription_lab.test_id = test.test_id
      JOIN appointment ON prescription_lab.prescription_id = appointment.prescription_id
      WHERE appointment.appointment_id = $1`,
      [appointmentId]
    );
    return res.json(tests.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//added after checking
router.put("/prescription_labtest/:appointmentId", async (req, res) => {
  try {
    console.log(
      "request coming from /doctorhome/prescriptionlab/:appointmentId"
    );
    const { appointmentId } = req.params;
    const { Test } = req.body;

    const insertedPrescriptions = await Promise.all(
      Test.map(async (test) => {
        const { name } = test; // Extract the name property from each test object
        const user = await pool.query(
          `WITH selected_test AS (
          SELECT test_id FROM test WHERE name = $1
        )
        INSERT INTO prescription_lab (prescription_id, test_id)
        SELECT (SELECT prescription_id FROM appointment WHERE appointment_id = $2), selected_test.test_id
        FROM selected_test
        WHERE check_test_exists((SELECT prescription_id FROM appointment WHERE appointment_id = $2), selected_test.test_id) = 0
        RETURNING *;
        `,
          [name, appointmentId] // Pass the name property and appointmentId separately
        );

        return user.rows; // Return the result rows
      })
    );

    return res.json(insertedPrescriptions.flat());
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/prescription_drug/:appointmentId", async (req, res) => {
  try {
    console.log(
      "request coming from /doctorhome/prescription_drug/:appointmentId"
    );
    const { appointmentId } = req.params;
    const user = await pool.query(
      `SELECT drug.name name, prescription_drug.dosage dosage, prescription_drug.days days
      FROM prescription_drug
      JOIN drug ON prescription_drug.drug_id = drug.drug_id
      JOIN appointment ON prescription_drug.prescription_id = appointment.prescription_id
      WHERE appointment.appointment_id = $1`,
      [appointmentId]
    );

    return res.json(user.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//addded after checking
router.put("/prescription_drug/:appointmentId", async (req, res) => {
  try {
    console.log(
      "request coming from /doctorhome/prescription_drug/:appointmentId"
    );
    const { appointmentId } = req.params;
    const { drugs } = req.body;

    const insertedPrescriptions = await Promise.all(
      drugs.map(async (drug) => {
        const { name, dosage, days } = drug;
        console.log(name, dosage, days, dosage);
        const user = await pool.query(
          `WITH selected_drug AS (
          SELECT drug_id FROM drug WHERE name = $1
        )
        INSERT INTO prescription_drug (prescription_id, drug_id, dosage, days) 
        SELECT  (SELECT prescription_id from appointment WHERE appointment_id = $4), drug_id, $2, $3 
        FROM selected_drug
        WHERE  check_drug_exists((SELECT prescription_id from appointment WHERE appointment_id = $4), drug_id) = 0
        RETURNING *;
        `,
          [name, dosage, days, appointmentId]
        );
        console.log(name, dosage, days);
        return user.rows;
      })
    );
    // console.log(name, dosage, days,dosage);

    return res.json(insertedPrescriptions.flat());
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(
  "/prescriptiondrug/:prescription_id",
  authorization,
  async (req, res) => {
    try {
      const { prescription_id } = req.params;
      const { drug_id, quantity, days } = req.body;
      const user = await pool.query(
        "INSERT INTO prescription_drug (prescription_id, drug_id,drug_name, dosage, days) VALUES ($1, $2, $3, $4) RETURNING *",
        [prescription_id, drug_id, quantity, days]
      );
      return res.json(user.rows);
    } catch (err) {
      console.log(err.message);
    }
  }
);

router.delete(
  "/deletedrug/:drugName/:appointmentId",
  async (req, res) => {
    try {
      const { appointmentId, drugName } = req.params;
      console.log(req.params);
      const user = await pool.query(
        `DELETE FROM prescription_drug 
        WHERE drug_id IN (SELECT drug_id FROM drug WHERE name = $2) 
        AND prescription_id = (SELECT prescription_id FROM appointment WHERE appointment_id = $1)`,
        [appointmentId, drugName]
      );
      return res.json(user.rows);
    } catch (err) {
      console.log(err.message);
    }
  }
);

router.delete(
  "/deletetest/:testName/:appointment_id",
  async (req, res) => {
    try {
      const { appointment_id, testName } = req.params;
      console.log(req.params)
      const tests = await pool.query(
        `Delete from prescription_lab 
        WHERE test_id = (SELECT test_id FROM test WHERE name=$1 )
        AND prescription_id = (SELECT prescription_id FROM appointment WHERE appointment_id = $2 ) `,
        [testName, appointment_id]
      );
      return res.json(tests.rows);
    } catch (err) {
      console.log(err.message);
    }
  }
);

router.get("/doctor-appointments", authorization, async (req, res) => {
  try {
    const doctor_id = req.user;
    const { status } = req.query;
    console.log(
      "request coming from /appointments/doctor-appointments/",
      doctor_id
    );
    // Fetch all appointments for the doctor from the database using doctor_id
    const appointments = await pool.query(
      `SELECT (p.first_name || ' '|| p.last_name) AS patient_name, a.appointment_id,
          a.appointment_date, a.contact_no, a.status 
          FROM appointment a 
          JOIN patient p ON a.patient_id = p.patient_id 
          WHERE a.doctor_id = $1`,
      [doctor_id]
    );
    console.log(appointments.rows);
    return res.json(appointments.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.get(
  "/doctor-approvedappointments/:doctor_id",
  authorization,
  async (req, res) => {
    try {
      const { doctor_id } = req.params;
      const { status } = req.query;
      console.log(
        "request coming from /appointments/doctor-approvedappointments/:doctor_id",
        doctor_id
      );

      // Fetch all appointments for the doctor from the database using doctor_id
      const appointments = await pool.query(
        `SELECT (p.first_name || ' '|| p.last_name) AS patient_name, a.appointment_id,
          a.appointment_date, a.contact_no, a.status 
          FROM appointment a 
          JOIN patient p ON a.patient_id = p.patient_id 
          WHERE a.doctor_id = $1 AND a.status = 'approved'`,
        [doctor_id] // Corrected parameter placement
      );
      console.log(appointments.rows);
      return res.json(appointments.rows); // Return the appointments as JSON response
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.get("/doctor-income/:doctor_id", authorization, async (req, res) => {
  try {
    const { doctor_id } = req.params;
    console.log(
      "request coming from /appointments/doctor-income/:doctor_id",
      doctor_id,
      "dw"
    );
    const income = await pool.query(
      `SELECT SUM(consultation_fee) AS income 
        FROM appointment 
        WHERE doctor_id = $1 AND status = 'approved'`,
      [doctor_id]
    );
    console.log(income.rows[0]);
    return res.json(income.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// Inside your backend route
router.post("/approve/:appointmentId", authorization, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    console.log(
      "request coming from /appointments/approve/:appointmentId",
      appointmentId
    );
    // Update appointment status to 'approved' in the database
    await pool.query(
      "UPDATE appointment SET status = $1 WHERE appointment_id = $2",
      ["approved", appointmentId]
    );

    // const result = await pool.query(`
    // INSERT INTO prescription (patient_type) VALUES ('In_Patient') RETURNING *
    // `);
    // const prescription_id = result.rows[0].prescription_id;
    // console.log("prescription_id ", prescription_id);

    // await pool.query(
    //   `
    // UPDATE appointment SET prescription_id = $1 WHERE appointment_id = $2
    // `,
    //   [prescription_id, appointmentId]
    // );

    // const result2 = await pool.query(
    //   `
    // SELECT appointment_date FROM appointment WHERE appointment_id = $1
    // `,
    //   [appointmentId]
    // );

    // const admit_date = new Date(result2.rows[0].appointment_date);
    // let dischargeDate = new Date(admit_date);
    // dischargeDate.setDate(dischargeDate.getDate() + 7);

    // await pool.query(
    //   `
    //   INSERT INTO in_patient (appointment_id,admit_date,discharge_date) VALUES ($1,$2,$3) RETURNING *`,
    //   [appointmentId, admit_date, dischargeDate]
    // );

    res.status(200).send("Appointment approved successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete/:appointmentId", authorization, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    console.log(
      "request coming from /appointments/delete/:appointmentId",
      appointmentId
    );
    // Delete the appointment from the database using the appointmentId
    await pool.query("DELETE FROM appointment WHERE appointment_id = $1", [
      appointmentId,
    ]);

    res.status(200).send("Appointment deleted successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});
router.get(
  "/doctorappointment/:appointmentId",
  authorization,
  async (req, res) => {
    try {
      console.log(
        "request coming from /appointments/doctorappointment/:appointmentId/dd",
        req.params.appointmentId
      );
      const { appointmentId } = req.params;
      const type = req.headers.type;
      console.log(appointmentId);
      const appointment = await pool.query(
        `SELECT  (P.first_name ||' '||P.last_name) patient_name,
      P.email patient_email,
      A.appointment_id ,
      A.type appointment_type,
      A.appointment_date date,
      A.contact_no contact_no 
      FROM appointment A 
      JOIN doctor D ON A.doctor_id = D.doctor_id 
      JOIN patient P on P.patient_id = A.patient_id 
      WHERE appointment_id = $1;`,
        [appointmentId]
      );
      console.log(appointment.rows[0]);
      return res.json(appointment.rows[0]);
    } catch (err) {
      console.error(err);
    }
  }
);
module.exports = router;
