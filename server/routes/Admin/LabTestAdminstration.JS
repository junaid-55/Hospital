const router = require("express").Router();
const pool = require("../../db");
const authorization = require("../../middleware/authorization");

router.get("", authorization, async (req, res) => {
  try {
    const labTests = await pool.query(
      `SELECT DISTINCT (pt.first_name || ' ' || pt.last_name) patient_name, apt.appointment_id appointment_id,(doctor.first_name || ' ' || doctor.last_name) doctor_name
             FROM in_patient ip
             JOIN appointment apt ON ip.appointment_id = apt.appointment_id
             JOIN patient pt ON apt.patient_id = pt.patient_id
             JOIN doctor ON apt.doctor_id = doctor.doctor_id
             WHERE CheckLabTestAdministration(ip.in_patient_id) = 1;`
    );
    return res.json(labTests.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.get("/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const labTest = await pool.query(
    `SELECT test_id, name 
            FROM test
            WHERE test_id IN (
                SELECT test_id 
                FROM prescription_lab 
                WHERE prescription_id = (
                    SELECT prescription_id 
                    FROM appointment a 
                    WHERE a.appointment_id = $1
            ))`,
      [id]
    );
    return res.json(labTest.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.post("/enter_result", authorization, async (req, res) => {
  try {
    const { test_result, appointment_id, test_id } = req.body;
    const result = await pool.query(`CALL enter_results($1,$2,$3)`, [
      test_id,
      test_result,
      appointment_id,
    ]);
    return res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});
module.exports = router;