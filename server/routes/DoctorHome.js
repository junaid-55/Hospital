const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("", authorization, async (req, res) => {
  try {
    console.log("request coming from /doctorhome/");
    const {
      headers: { "request-type": type },
    } = req;
   // if (type && type === "user_info")
     
      const id = req.user;
      const user = await pool.query(
       ` SELECT appointment_id, doctor_id, first_name, last_name, email, doctor.contact_no, experience, schedule, department_title, title, consultation_fee 
        FROM doctor 
        JOIN department USING(department_id) 
        join appointment using(doctor_id)
        WHERE doctor_id = $1`,
                [id]
      );
      console.log(user.rows[0]);
      return res.json(user.rows[0]);
    // } else if (type && type === "all_doctors") {
    //   const user = await pool.query(
    //     "SELECT doctor_id, first_name,department_title,experience,schedule,consultation_fee,doctor.contact_no FROM doctor JOIN department USING(department_id)"
    //   );
    //   return res.json(user.rows);
    // }
  } catch (err) {
    console.log(err.message);
  }
});

router.post("", async (req, res) => {
  try {
    const { "request-type": type, criteria: criteria } = req.headers;
    if (type && type === "search") {
      let user;
      if (criteria === "Name") {
        console.log("here");
        const { name } = req.body;
        user = await pool.query(
          "SELECT doctor_id, first_name,department_title,experience,schedule,consultation_fee FROM doctor JOIN department USING(department_id) WHERE UPPER(first_name) LIKE $1 ",
          [`%${name.toUpperCase()}%`]
        );
      } else {
        const { name } = req.body;
        user = await pool.query(
          "SELECT doctor_id, first_name,department_title,experience,schedule,consultation_fee FROM doctor JOIN department USING(department_id) WHERE UPPER(department_title) LIKE $1 ",
          [`%${name.toUpperCase()}%`]
        );
      }

      return res.json(user.rows);
    }

    return res.status(500).send("Your fault");
  } catch (err) {
    console.log(err.message);
  }
});

// router.post("appointment", authorization, async(req, res) =>{
//   try{
//       const [doctor_id,  ]
//   }catch(err)
//   {
//     console.log(err.message);
//   }
// });
router.put("/makeprescription/:appointmentId", async (req, res) => {
  try {
    console.log("request coming from /doctorhome/makeprescription/:appointmentId");
    const { appointmentId } = req.params;
    const user = await pool.query(
      `INSERT INTO prescription (prescription_id)
       VALUES ($1) RETURNING *`,
      [appointmentId]
    );
    return res.json(user.rows);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "An error occurred while updating prescription." });
  }
});
router.put("/prescription/:appointmentId", async (req, res) => {
  try {
    console.log("request coming from /doctorhome/prescription/:appointmentId");
    const { appointmentId } = req.params;
    const { diseaseName, patientType, date, advice } = req.body;
    console.log(appointmentId, diseaseName, patientType, date, advice);
    const user = await pool.query(
      `INSERT INTO prescription (prescription_id, disease_name, patient_type, date, advice)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (prescription_id) DO UPDATE 
       SET disease_name = EXCLUDED.disease_name, patient_type = EXCLUDED.patient_type, 
           date = EXCLUDED.date, advice = EXCLUDED.advice
       RETURNING *`,
      [appointmentId, diseaseName, patientType, date, advice]
    );
    
    return res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "An error occurred while updating prescription." });
  }
});

router.put("/prescription_labtest/:appointmentId", async (req, res) => {
  try {
    console.log("request coming from /doctorhome/prescriptionlab/:appointmentId");
    const { appointmentId } = req.params;
    const { Test } = req.body;

    const insertedPrescriptions = await Promise.all(Test.map(async (test) => {
      const { name } = test; // Extract the name property from each test object

      const user = await pool.query(
        `
        WITH selected_test AS (
          SELECT test_id FROM test WHERE name = $1
        )
        INSERT INTO prescription_lab (prescription_id, test_id)
        SELECT $2, selected_test.test_id
        FROM selected_test
        ON CONFLICT ON CONSTRAINT unique_prescription_lab 
        DO NOTHING
        RETURNING *;
        `,
        [name, appointmentId] // Pass the name property and appointmentId separately
      );

      return user.rows; // Return the result rows
    }));

    return res.json(insertedPrescriptions.flat());
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put("/prescription_surgery/:appointmentId", async (req, res) => {
  try {
    console.log("request coming from /doctorhome/prescriptionsurgery/:appointmentId");
    const { appointmentId } = req.params;
    const { Surgery } = req.body;

    const insertedPrescriptions = await Promise.all(Surgery.map(async (surgery) => {
      const { name, date } = surgery;
      console.log(name, date);
      
      const user = await pool.query(
        `
        WITH selected_surgery AS (
          SELECT surgery_id FROM surgery WHERE name = $1
        )
        INSERT INTO prescription_surgery (prescription_id, surgery_id, date)
        SELECT $2, surgery_id, $3 FROM selected_surgery
        ON CONFLICT ON CONSTRAINT unique_prescription_surgery
        DO UPDATE SET date = EXCLUDED.date
        WHERE prescription_surgery.surgery_id = EXCLUDED.surgery_id
        RETURNING *;
        `,
        [name, appointmentId, date]
      );
      
      console.log(name, date);
      return user.rows;
    }));

    return res.json(insertedPrescriptions.flat());
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/prescription_drug/:appointmentId", async (req, res) => {
  try {
    console.log("request coming from /doctorhome/prescription_drug/:appointmentId");
    const { appointmentId } = req.params;
    const { drugs } = req.body;
    
    const insertedPrescriptions = await Promise.all(drugs.map(async (drug) => {
      const { name, dosage, days } = drug;
      console.log(name, dosage, days,dosage);
      const user = await pool.query(
        `WITH selected_drug AS (
          SELECT drug_id FROM drug WHERE name = $1
        )
        INSERT INTO prescription_drug (prescription_id, drug_id,drug_name, dosage, days) 
        SELECT $4, drug_id,$1, $2, $3 FROM selected_drug
        ON CONFLICT ON CONSTRAINT unique_prescription_drug  
        DO UPDATE 
          SET dosage = EXCLUDED.dosage,
              days = EXCLUDED.days
        WHERE prescription_drug.drug_id = EXCLUDED.drug_id
        RETURNING *;
      
        `,
               [name, dosage, days,appointmentId]
      );

      console.log(name, dosage, days);

      return user.rows;
    }));
    console.log(name, dosage, days,dosage);

    return res.json(insertedPrescriptions.flat());
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/drug",  async (req, res) => {
  try {
    console.log("request coming from /doctorhome/drug");
    const { "request-type": type } = req.headers;
   
      const user = await pool.query("SELECT * FROM drug");
      return res.json(user.rows);
    
  } catch (err) {
    console.log(err.message);
  }
});
router.get("/test",  async (req, res) => {
  try {
    console.log("request coming from /doctorhome/test");
    const { "request-type": type } = req.headers;
   
      const user = await pool.query("SELECT * FROM test");
      return res.json(user.rows);
    
  } catch (err) {
    console.log(err.message);
  }
});
router.get("/surgery",  async (req, res) => {
  try {
    console.log("request coming from /doctorhome/surgery");
    const { "request-type": type } = req.headers;
   
      const user = await pool.query("SELECT * FROM surgery");
      return res.json(user.rows);
    
  } catch (err) {
    console.log(err.message);
  }
}
);
router.post("/prescriptiondrug/:prescription_id", authorization, async (req, res) => {
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
});

router.delete("/deletedrug/:drugName,appointmentId", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("DELETE FROM prescription_drug WHERE drug_id = $1", [id]);
    return res.json(user.rows);
  } catch (err) {
    console.log(err.message);
  }
});
router.delete("/deletetest/:testName,appointment_id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("Delete from prescription_lab where test_name=$1 and(select from prescription ) ", [id]);

    return res.json(user.rows);
  } catch (err) {
    console.log(err.message);
  }
});
router.get("/doctor-appointments/:doctor_id", authorization, async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const { status } = req.query;
    console.log("request coming from /appointments/doctor-appointments/:doctor_id", doctor_id);
    // Fetch all appointments for the doctor from the database using doctor_id
    const appointments = await pool.query(
      `SELECT (p.first_name || ' '|| p.last_name) AS patient_name, a.appointment_id,
      a.appointment_date, a.contact_no, a.status 
      FROM appointment a 
      JOIN patient p ON a.patient_id = p.patient_id 
      WHERE a.doctor_id = $1 AND a.status = 'pending'`,
      [doctor_id]
    );

    return res.json(appointments.rows); // Return the appointments as JSON response
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.get("/doctor-approvedappointments/:doctor_id", authorization, async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const { status } = req.query;
    console.log("request coming from /appointments/doctor-approvedappointments/:doctor_id", doctor_id);
    
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
});

router.get("/doctor-income/:doctor_id", authorization, async (req, res) => {
  try {
    const { doctor_id } = req.params;
    console.log("request coming from /appointments/doctor-income/:doctor_id", doctor_id,"dw");
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
router.post('/approve/:appointmentId', authorization, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    console.log("request coming from /appointments/approve/:appointmentId", appointmentId);
    // Update appointment status to 'approved' in the database
    await pool.query(
      'UPDATE appointment SET status = $1 WHERE appointment_id = $2',
      ['approved', appointmentId]
    );

    res.status(200).send('Appointment approved successfully');
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/delete/:appointmentId', authorization, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    console.log("request coming from /appointments/delete/:appointmentId", appointmentId);
    // Delete the appointment from the database using the appointmentId
    await pool.query('DELETE FROM appointment WHERE appointment_id = $1', [appointmentId]);

    res.status(200).send('Appointment deleted successfully');
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});
router.get("/doctorappointment/:appointmentId", authorization, async (req, res) => {
  try {
    console.log("request coming from /appointments/doctorappointment/:appointmentId/dd", req.params.appointmentId);
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
      WHERE appointment_id = $1;`, [appointmentId]
    );
    console.log(appointment.rows[0]);
    return res.json(appointment.rows[0]);
  } catch (err) {
    console.error(err);
  }
});
router.get("/doctor-surgery", async (req, res) => {
  try {
    console.log("request coming from /appointments/doctor-surgery/:appointmentId");
    const type = req.headers.type;
    console.log(appointmentId);
    const surgery = await pool.query(
      `SELECT st.*,s.* FROM surgery_taken st
      join surgery s on s.surgery_id = st.surgery_id
      join in_patient ip on ip.in_patient_id = st.in_patient_id
      join appointment a on a.appointment_id = ip.appointment_id
      ;`
    );
    console.log(surgery.rows);
    return res.json(surgery.rows);
  } catch (err) {
    console.error(err);
  }
});
router.get("/doctor-approvedsurgeries/:appointmentId",  async (req, res) => {
  try {
    console.log("request coming from /appointments/doctor-approvedsurgeries/:appointmentId");
    const { appointmentId } = req.params;
    const type = req.headers.type;
    console.log(appointmentId);
    const surgery = await pool.query(
      `SELECT st.*,s.* FROM surgery_taken st
      join surgery s on s.surgery_id = st.surgery_id
      join in_patient ip on ip.in_patient_id = st.in_patient_id
      join appointment a on a.appointment_id = ip.appointment_id
      where a.appointment_id = $1 and st.status = 'approved'
      ;`, [appointmentId]
    );
  
    console.log(surgery.rows);
    return res.json(surgery.rows);
  } catch (err) {
    console.error(err);
  }
}
);
router.get("/doctor-approvesurgery/:appointmentId",  async (req, res) => {
  try {
    console.log("request coming from /appointments/doctor-approvesurg/:appointmentId");
    const { appointmentId } = req.params;
    const type = req.headers.type;
    console.log(appointmentId);
    const surgery = await pool.query(
      `UPDATE surgery_taken AS st
      SET status = 'approved'
      FROM surgery AS s
      JOIN in_patient AS ip ON ip.in_patient_id = st.in_patient_id
      JOIN appointment AS a ON a.appointment_id = ip.appointment_id
      WHERE a.appointment_id = $1 AND st.status = 'pending'
      AND s.surgery_id = st.surgery_id;
      `, [appointmentId]
    );
  
    console.log(surgery.rows);
    return res.json(surgery.rows);
  } catch (err) {
    console.error(err);
  }
});


module.exports = router;
