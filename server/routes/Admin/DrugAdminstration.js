const router = require("express").Router();
const pool = require("../../db");
const authorization = require("../../middleware/authorization");

router.get("", authorization, async (req, res) => {
  try {
    const patients = await pool.query(
      `SELECT DISTINCT (pt.first_name || ' ' || pt.last_name) patient_name, apt.appointment_id appointment_id,(doctor.first_name || ' ' || doctor.last_name) doctor_name
        FROM in_patient ip 
        JOIN appointment apt ON ip.appointment_id = apt.appointment_id
        JOIN patient pt ON apt.patient_id = pt.patient_id
        JOIN doctor ON apt.doctor_id = doctor.doctor_id
        WHERE CheckDrugAdministration(ip.in_patient_id) = 1;`
      //have to add this when all is available
      // WHERE CURRENT_DATE  BETWEEN ip.admit_date AND ip.discharge_date; `
    );
    console.log(patients.rows);
    return res.json(patients.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.get("/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const drugs = await pool.query(
      `
    SELECT pd.drug_id drug_id, (SELECT name FROM drug WHERE drug_id = pd.drug_id),pd.dosage dosage 
    FROM prescription_drug pd
    WHERE drug_id IN (
        SELECT drug_id 
        FROM prescription_drug 
        WHERE prescription_id = (
            SELECT prescription_id 
            FROM appointment a 
            WHERE a.appointment_id = $1
        ) 
        EXCEPT (
            SELECT drug_id 
            FROM drug_taken
            WHERE in_patient_id = (
                SELECT in_patient_id 
                FROM in_patient ip
                WHERE ip.appointment_id = $1
            )  
            AND taken_date = CURRENT_DATE::DATE
        )
    ) AND prescription_id = ( 
        SELECT prescription_id 
        FROM appointment a 
        WHERE a.appointment_id = $1
        )`,
      [id]
    );
    console.log(drugs.rows);
    return res.json(drugs.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.post("/give", authorization, async (req, res) => {
  try {
    let { drug_id, appointment_id, count } = req.body;
    count = Number(count); // Convert count to a number
    const drug = await pool.query(
      `INSERT INTO drug_taken (drug_id,quantity, in_patient_id,price ,taken_date) 
      VALUES ($1, $2,(SELECT in_patient_id FROM in_patient WHERE appointment_id = $3),
      (SELECT price FROM drug WHERE drug_id = $1), CURRENT_DATE)`,
      [drug_id, count, appointment_id]
    );
    return res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
